import type { Customer, Feature, Plan, Scenario } from "@/lib/types";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";
import { runSimulation } from "@/lib/simulation/engine";

export const features: Feature[] = [
  { id: "f-analytics", key: "analytics", name: "Product Analytics", description: "Usage analytics and funnels.", category: "Analytics", isBusinessCritical: false },
  { id: "f-sso", key: "sso", name: "SSO", description: "SAML/OIDC single sign-on.", category: "Security", isBusinessCritical: true },
  { id: "f-audit", key: "advanced_audit_logs", name: "Advanced Audit Logs", description: "Exportable audit trails.", category: "Security", isBusinessCritical: true },
  { id: "f-roles", key: "custom_roles", name: "Custom Roles", description: "Role-based access controls.", category: "Administration", isBusinessCritical: true },
  { id: "f-api", key: "public_api", name: "Public API", description: "API access for integrations.", category: "Platform", isBusinessCritical: false },
  { id: "f-webhooks", key: "webhooks", name: "Webhooks", description: "Event webhooks.", category: "Platform", isBusinessCritical: false },
  { id: "f-exports", key: "scheduled_exports", name: "Scheduled Exports", description: "Automated CSV exports.", category: "Operations", isBusinessCritical: false },
  { id: "f-sandbox", key: "sandbox", name: "Sandbox Workspace", description: "Testing workspace.", category: "Platform", isBusinessCritical: false },
  { id: "f-ai", key: "ai_insights", name: "AI Insights", description: "AI-generated account insights.", category: "Analytics", isBusinessCritical: false },
  { id: "f-support", key: "priority_support", name: "Priority Support", description: "Faster support SLA.", category: "Support", isBusinessCritical: true },
  { id: "f-csm", key: "dedicated_csm", name: "Dedicated CSM", description: "Named success manager.", category: "Support", isBusinessCritical: true },
  { id: "f-scim", key: "scim", name: "SCIM Provisioning", description: "User provisioning.", category: "Security", isBusinessCritical: true },
  { id: "f-data", key: "data_residency", name: "Data Residency", description: "Regional data residency.", category: "Compliance", isBusinessCritical: true },
  { id: "f-dpa", key: "dpa", name: "DPA Workflow", description: "DPA approvals.", category: "Compliance", isBusinessCritical: false },
  { id: "f-white", key: "white_label", name: "White Label", description: "Brand customization.", category: "Experience", isBusinessCritical: false },
  { id: "f-ab", key: "ab_testing", name: "A/B Testing", description: "Experimentation tools.", category: "Growth", isBusinessCritical: false },
  { id: "f-entitlements", key: "entitlements", name: "Entitlements", description: "Plan entitlement controls.", category: "Monetization", isBusinessCritical: true },
  { id: "f-billing", key: "billing_sync", name: "Billing Sync", description: "Billing platform sync.", category: "Monetization", isBusinessCritical: true },
  { id: "f-alerts", key: "risk_alerts", name: "Risk Alerts", description: "Risk notifications.", category: "Success", isBusinessCritical: false },
  { id: "f-segments", key: "segments", name: "Segments", description: "Customer segmentation.", category: "Growth", isBusinessCritical: false },
  { id: "f-forecast", key: "forecasting", name: "Forecasting", description: "Revenue forecasting.", category: "Revenue", isBusinessCritical: false },
  { id: "f-approval", key: "approval_flows", name: "Approval Flows", description: "Workflow approvals.", category: "Operations", isBusinessCritical: false },
  { id: "f-mobile", key: "mobile_access", name: "Mobile Access", description: "Mobile app access.", category: "Experience", isBusinessCritical: false },
  { id: "f-sla", key: "sla_reporting", name: "SLA Reporting", description: "SLA dashboards.", category: "Support", isBusinessCritical: true },
  { id: "f-warehouse", key: "warehouse_sync", name: "Warehouse Sync", description: "Warehouse exports.", category: "Data", isBusinessCritical: false }
];

export const currentPlans: Plan[] = [
  { id: "plan-current-free", planType: "CURRENT", name: "Free", monthlyPrice: 0, annualPrice: 0, usageLimits: { seats: 3, events: 1000 }, supportLevel: "Community", featureKeys: ["analytics", "mobile_access"] },
  { id: "plan-current-starter", planType: "CURRENT", name: "Starter", monthlyPrice: 99, annualPrice: 1188, usageLimits: { seats: 10, events: 25000 }, supportLevel: "Email", featureKeys: ["analytics", "public_api", "webhooks", "segments", "mobile_access"] },
  { id: "plan-current-pro", planType: "CURRENT", name: "Pro", monthlyPrice: 399, annualPrice: 4788, usageLimits: { seats: 75, events: 300000 }, supportLevel: "Priority", featureKeys: ["analytics", "sso", "advanced_audit_logs", "custom_roles", "public_api", "webhooks", "scheduled_exports", "sandbox", "ai_insights", "priority_support", "segments", "ab_testing", "entitlements", "billing_sync", "risk_alerts", "forecasting", "approval_flows", "warehouse_sync"] },
  { id: "plan-current-enterprise", planType: "CURRENT", name: "Enterprise", monthlyPrice: 1299, annualPrice: 15588, usageLimits: { seats: "Unlimited", events: "Custom" }, supportLevel: "Dedicated CSM", featureKeys: features.map((feature) => feature.key) }
];

export const proposedPlans: Plan[] = [
  { id: "plan-proposed-free", planType: "PROPOSED", name: "Free", monthlyPrice: 0, annualPrice: 0, usageLimits: { seats: 3, events: 1000 }, supportLevel: "Community", featureKeys: ["analytics", "mobile_access"] },
  { id: "plan-proposed-growth", planType: "PROPOSED", name: "Growth", monthlyPrice: 149, annualPrice: 1788, usageLimits: { seats: 20, events: 60000 }, supportLevel: "Email", featureKeys: ["analytics", "public_api", "webhooks", "segments", "mobile_access", "ab_testing"] },
  { id: "plan-proposed-business", planType: "PROPOSED", name: "Business", monthlyPrice: 549, annualPrice: 6588, usageLimits: { seats: 100, events: 500000 }, supportLevel: "Priority", featureKeys: ["analytics", "custom_roles", "public_api", "webhooks", "scheduled_exports", "sandbox", "ai_insights", "priority_support", "segments", "ab_testing", "entitlements", "billing_sync", "risk_alerts", "forecasting", "approval_flows", "warehouse_sync"] },
  { id: "plan-proposed-enterprise", planType: "PROPOSED", name: "Enterprise", monthlyPrice: 1499, annualPrice: 17988, usageLimits: { seats: "Unlimited", events: "Custom" }, supportLevel: "Dedicated CSM", featureKeys: features.map((feature) => feature.key) }
];

export const plans = [...currentPlans, ...proposedPlans];

const companyRoots = [
  "Northstar", "Banyan", "Vector", "Acme", "Helio", "Brightpath", "Mosaic", "Nimbus", "Tandem", "Orbit",
  "Signal", "Kite", "Ledger", "Atlas", "River", "Summit", "Evergreen", "Quartz", "Meridian", "Beacon"
];
const suffixes = ["Labs", "Cloud", "Systems", "Works", "HQ", "Software", "Data", "AI", "Ops", "Group"];
const regions = ["India", "US", "Europe", "APAC"];
const owners = ["Anika Rao", "Maya Chen", "Luis Garcia", "Noah Williams", "Priya Nair", "Jordan Lee"];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function addDays(days: number): string {
  const date = new Date("2026-07-31T00:00:00.000Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function buildDemoCustomers(count = 250): Customer[] {
  const customers: Customer[] = [];
  for (let index = 0; index < count; index += 1) {
    const segment = index % 10 === 0 ? "Enterprise" : index % 3 === 0 ? "Mid-Market" : "SMB";
    const plan = segment === "Enterprise" ? currentPlans[3] : index % 4 === 0 ? currentPlans[1] : index % 5 === 0 ? currentPlans[0] : currentPlans[2];
    const multiplier = segment === "Enterprise" ? 8 + (index % 6) : segment === "Mid-Market" ? 2 + (index % 4) : 1 + (index % 3) * 0.35;
    const arr = Math.round(plan.annualPrice * multiplier);
    const featurePool = plan.featureKeys;
    const usageCount = Math.min(featurePool.length, 7 + (index % 8));
    const featureUsage = Array.from({ length: usageCount }, (_, featureIndex) => {
      const featureKey = featurePool[(featureIndex * 3 + index) % featurePool.length];
      const feature = features.find((item) => item.key === featureKey)!;
      const securityBoost = feature.key === "sso" || feature.key === "advanced_audit_logs" ? 180 : 0;
      return {
        featureId: feature.id,
        featureKey: feature.key,
        featureName: feature.name,
        usageCountLast30Days: 5 + ((index + featureIndex) * 13) % 180 + Math.round(securityBoost / 4),
        usageCountLast90Days: 20 + ((index + featureIndex) * 31) % 500 + securityBoost,
        isBusinessCritical: feature.isBusinessCritical || (feature.key === "sso" && index % 2 === 0)
      };
    });
    if (plan.name === "Pro" && index % 2 === 0 && !featureUsage.some((usage) => usage.featureKey === "sso")) {
      featureUsage.push({ featureId: "f-sso", featureKey: "sso", featureName: "SSO", usageCountLast30Days: 72 + index, usageCountLast90Days: 260 + index * 2, isBusinessCritical: true });
    }
    if (plan.name === "Pro" && index % 3 === 0 && !featureUsage.some((usage) => usage.featureKey === "advanced_audit_logs")) {
      featureUsage.push({ featureId: "f-audit", featureKey: "advanced_audit_logs", featureName: "Advanced Audit Logs", usageCountLast30Days: 49 + index, usageCountLast90Days: 180 + index, isBusinessCritical: true });
    }
    const renewalDays = 15 + ((index * 17) % 365);
    const healthScore = Math.max(20, Math.min(95, 92 - (index % 13) * 4 - (segment === "Enterprise" && index % 4 === 0 ? 12 : 0)));
    const supportTickets = (index * 7) % 21;
    customers.push({
      id: `cust-${index + 1}`,
      externalCustomerId: `CUST-${String(index + 1).padStart(4, "0")}`,
      companyName: `${pick(companyRoots, index)} ${pick(suffixes, index * 2)}`,
      segment,
      region: pick(regions, index),
      currentPlanId: plan.id,
      currentPlanName: plan.name,
      mrr: Math.round(arr / 12),
      arr,
      renewalDate: addDays(renewalDays),
      contractType: segment === "Enterprise" ? "Annual enterprise agreement" : index % 2 === 0 ? "Annual" : "Monthly",
      customerSuccessOwner: pick(owners, index),
      healthScore,
      supportTicketCountLast90Days: supportTickets,
      featureUsage,
      contract: {
        renewalDate: addDays(renewalDays),
        contractEndDate: addDays(renewalDays + 365),
        discountPercentage: index % 8 === 0 ? 20 : index % 5 === 0 ? 10 : 0,
        customTerms: segment === "Enterprise" ? "Security review and executive business review required." : "Standard commercial terms.",
        canChangePriceBeforeRenewal: !(segment === "Enterprise" || index % 6 === 0)
      }
    });
  }
  return customers;
}

export const customers = buildDemoCustomers();

export const demoScenario: Scenario = {
  id: "scenario-sso-audit-pro-to-enterprise",
  name: "Move SSO and Advanced Audit Logs from Pro to Enterprise",
  description: "Evaluate moving advanced security controls out of Pro and into Enterprise while protecting high-risk accounts.",
  pricingChangeType: "Move feature to higher plan",
  affectedPlanIds: ["plan-current-pro", "Pro"],
  proposedPlanIds: ["plan-proposed-business", "plan-proposed-enterprise"],
  affectedFeatureIds: ["f-sso", "f-audit", "sso", "advanced_audit_logs"],
  migrationStartDate: "2026-09-01",
  migrationEndDate: "2027-03-01",
  grandfatheringRule: "Grandfather high-risk accounts",
  revenueAssumption: "Customers map from Pro to Business unless they need Enterprise-only security controls.",
  churnRiskAssumption: "Feature loss and renewal proximity are the largest churn-risk drivers.",
  discountStrategy: "Temporary discount",
  notes: "Strong demo scenario for pricing and packaging portfolio review."
};

export const demoResult = runSimulation(demoScenario, customers, plans, defaultRiskWeights);
