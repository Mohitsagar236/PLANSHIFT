import { customers, currentPlans, demoResult, proposedPlans } from "@/lib/demo/data";

export function segmentCounts() {
  return ["SMB", "Mid-Market", "Enterprise"].map((segment) => ({
    name: segment,
    value: demoResult.impacts.filter((impact) => impact.segment === segment).length
  }));
}

export function riskDistribution() {
  return [
    { name: "Low", value: demoResult.impacts.filter((impact) => impact.churnRiskScore < 40).length },
    { name: "Medium", value: demoResult.impacts.filter((impact) => impact.churnRiskScore >= 40 && impact.churnRiskScore < 70).length },
    { name: "High", value: demoResult.impacts.filter((impact) => impact.churnRiskScore >= 70).length }
  ];
}

export function planDistribution(type: "current" | "proposed") {
  const planNames = type === "current" ? currentPlans.map((plan) => plan.name) : proposedPlans.map((plan) => plan.name);
  return planNames.map((name) => ({
    name,
    value:
      type === "current"
        ? customers.filter((customer) => customer.currentPlanName === name).length
        : demoResult.impacts.filter((impact) => impact.proposedPlan === name).length
  }));
}

export function featureLossImpact() {
  const features = new Map<string, number>();
  for (const impact of demoResult.impacts) {
    for (const feature of impact.lostFeatureNames) {
      features.set(feature, (features.get(feature) ?? 0) + 1);
    }
  }
  return Array.from(features.entries()).map(([name, value]) => ({ name, value }));
}
