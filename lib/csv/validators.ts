import Papa from "papaparse";
import { z } from "zod";

export const csvSchemas = {
  customers: z.object({
    customer_id: z.string().min(1),
    company_name: z.string().min(1),
    segment: z.enum(["SMB", "Mid-Market", "Enterprise"]),
    region: z.string().min(1),
    current_plan: z.string().min(1),
    mrr: z.coerce.number().nonnegative(),
    arr: z.coerce.number().nonnegative(),
    renewal_date: z.string().min(1),
    contract_type: z.string().min(1),
    customer_success_owner: z.string().min(1),
    health_score: z.coerce.number().min(0).max(100),
    support_ticket_count_last_90_days: z.coerce.number().int().nonnegative()
  }),
  current_plans: z.object({
    plan_id: z.string().min(1),
    plan_name: z.string().min(1),
    monthly_price: z.coerce.number().nonnegative(),
    annual_price: z.coerce.number().nonnegative(),
    included_features: z.string().min(1),
    usage_limits: z.string().min(1),
    support_level: z.string().min(1)
  }),
  proposed_plans: z.object({
    plan_id: z.string().min(1),
    plan_name: z.string().min(1),
    monthly_price: z.coerce.number().nonnegative(),
    annual_price: z.coerce.number().nonnegative(),
    included_features: z.string().min(1),
    usage_limits: z.string().min(1),
    support_level: z.string().min(1)
  }),
  feature_usage: z.object({
    customer_id: z.string().min(1),
    feature_key: z.string().min(1),
    feature_name: z.string().min(1),
    usage_count_last_30_days: z.coerce.number().int().nonnegative(),
    usage_count_last_90_days: z.coerce.number().int().nonnegative(),
    is_business_critical: z.coerce.boolean()
  }),
  contracts: z.object({
    customer_id: z.string().min(1),
    renewal_date: z.string().min(1),
    contract_end_date: z.string().min(1),
    discount_percentage: z.coerce.number().min(0).max(100),
    custom_terms: z.string(),
    can_change_price_before_renewal: z.coerce.boolean()
  })
};

export type CsvType = keyof typeof csvSchemas;

export type CsvValidationError = {
  rowNumber: number;
  field: string;
  message: string;
  rawData: Record<string, unknown>;
};

export type CsvValidationResult = {
  type: CsvType;
  headers: string[];
  totalRows: number;
  validRows: Record<string, unknown>[];
  errors: CsvValidationError[];
};

export function validateCsv(type: CsvType, csvText: string): CsvValidationResult {
  const parsed = Papa.parse<Record<string, unknown>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });
  const schema = csvSchemas[type];
  const validRows: Record<string, unknown>[] = [];
  const errors: CsvValidationError[] = [];
  const headers = parsed.meta.fields ?? [];
  const requiredHeaders = Object.keys(schema.shape);
  for (const required of requiredHeaders) {
    if (!headers.includes(required)) {
      errors.push({ rowNumber: 0, field: required, message: "Missing required column", rawData: {} });
    }
  }
  parsed.data.forEach((row, index) => {
    const result = schema.safeParse(row);
    if (result.success) {
      validRows.push(result.data);
    } else {
      for (const issue of result.error.issues) {
        errors.push({
          rowNumber: index + 2,
          field: String(issue.path[0] ?? "row"),
          message: issue.message,
          rawData: row
        });
      }
    }
  });
  return {
    type,
    headers,
    totalRows: parsed.data.length,
    validRows,
    errors
  };
}
