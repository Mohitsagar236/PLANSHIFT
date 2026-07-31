import { describe, expect, it } from "vitest";
import { validateCsv } from "@/lib/csv/validators";
import { customers, demoScenario, plans } from "@/lib/demo/data";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";
import { runSimulation } from "@/lib/simulation/engine";

describe("product workflows", () => {
  it("creates a scenario and runs a simulation", () => {
    const result = runSimulation({ ...demoScenario, name: "Integration scenario" }, customers, plans, defaultRiskWeights);
    expect(result.affectedCustomersCount).toBeGreaterThan(50);
    expect(result.reportMarkdown).toContain("Decision recommendation");
  });

  it("validates imported CSV rows", () => {
    const csv = "customer_id,company_name,segment,region,current_plan,mrr,arr,renewal_date,contract_type,customer_success_owner,health_score,support_ticket_count_last_90_days\nCUST-9,Test Co,Enterprise,US,Pro,999,11988,2026-10-01,Annual,Ana,42,7";
    const result = validateCsv("customers", csv);
    expect(result.validRows).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("updates risk weights and reruns simulation", () => {
    const result = runSimulation(demoScenario, customers, plans, { ...defaultRiskWeights, businessCriticalFeatureWeight: 40, healthScoreWeight: 20 });
    expect(result.highRiskCustomersCount).toBeGreaterThan(0);
  });
});
