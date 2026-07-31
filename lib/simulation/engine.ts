import type {
  Customer,
  CustomerImpact,
  Feature,
  Plan,
  RiskWeights,
  Scenario,
  SimulationResult,
  StrategyComparison
} from "@/lib/types";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";

const DAY_MS = 24 * 60 * 60 * 1000;
const today = new Date("2026-07-31T00:00:00.000Z");

export function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function calculateCurrentARR(customers: Customer[]): number {
  return customers.reduce((sum, customer) => sum + customer.arr, 0);
}

export function mapTargetPlan(customer: Customer, plans: Plan[], scenario: Scenario): Plan {
  const currentRank: Record<string, string> = {
    Free: "Free",
    Starter: "Growth",
    Pro: "Business",
    Enterprise: "Enterprise"
  };
  const requested = scenario.proposedPlanIds
    .map((id) => plans.find((plan) => plan.id === id))
    .filter(Boolean) as Plan[];
  const matching = requested.find((plan) => plan.name === currentRank[customer.currentPlanName]);
  return matching ?? plans.find((plan) => plan.name === currentRank[customer.currentPlanName]) ?? plans[plans.length - 1];
}

export function calculateCustomerPriceDelta(customer: Customer, scenario: Scenario, plans: Plan[]): {
  monthlyPriceDelta: number;
  annualPriceDelta: number;
  proposedPlan: Plan;
} {
  const current = plans.find((plan) => plan.id === customer.currentPlanId) ?? plans.find((plan) => plan.name === customer.currentPlanName);
  const proposed = mapTargetPlan(customer, plans.filter((plan) => plan.planType === "PROPOSED"), scenario);
  const monthlyPriceDelta = (proposed?.monthlyPrice ?? 0) - (current?.monthlyPrice ?? customer.mrr);
  const annualPriceDelta = (proposed?.annualPrice ?? 0) - (current?.annualPrice ?? customer.arr);
  return { monthlyPriceDelta, annualPriceDelta, proposedPlan: proposed };
}

export function detectFeatureLoss(customer: Customer, scenario: Scenario, plans: Plan[]): Feature[] {
  const target = mapTargetPlan(customer, plans.filter((plan) => plan.planType === "PROPOSED"), scenario);
  const lostUsage = customer.featureUsage.filter((usage) => {
    const isAffected = scenario.affectedFeatureIds.includes(usage.featureId) || scenario.affectedFeatureIds.includes(usage.featureKey);
    return isAffected && !target.featureKeys.includes(usage.featureKey);
  });
  return lostUsage.map((usage) => ({
    id: usage.featureId,
    key: usage.featureKey,
    name: usage.featureName,
    description: "Used by customer but not available in the proposed target plan.",
    category: "Packaging",
    isBusinessCritical: usage.isBusinessCritical
  }));
}

export function detectBusinessCriticalFeatureLoss(customer: Customer, scenario: Scenario, plans: Plan[]): Feature[] {
  return detectFeatureLoss(customer, scenario, plans).filter((feature) => feature.isBusinessCritical);
}

export function calculateRenewalProximityRisk(customer: Customer): number {
  const renewal = new Date(customer.renewalDate);
  const daysUntilRenewal = Math.ceil((renewal.getTime() - today.getTime()) / DAY_MS);
  if (daysUntilRenewal < 0) return 35;
  if (daysUntilRenewal <= 30) return 100;
  if (daysUntilRenewal <= 60) return 75;
  if (daysUntilRenewal <= 90) return 45;
  return 10;
}

export function calculateContractRestrictionRisk(customer: Customer): number {
  if (!customer.contract) return 15;
  return customer.contract.canChangePriceBeforeRenewal ? 10 : 100;
}

export function calculateSupportBurdenRisk(customer: Customer): number {
  const tickets = customer.supportTicketCountLast90Days;
  if (tickets > 12) return 100;
  if (tickets > 5) return 70;
  if (tickets > 2) return 35;
  return 10;
}

export function calculateHealthScoreRisk(customer: Customer): number {
  if (customer.healthScore < 35) return 100;
  if (customer.healthScore < 50) return 80;
  if (customer.healthScore < 70) return 45;
  return 10;
}

export function calculateFeatureUsageRisk(customer: Customer, scenario: Scenario): number {
  const affectedUsage = customer.featureUsage.filter(
    (usage) => scenario.affectedFeatureIds.includes(usage.featureId) || scenario.affectedFeatureIds.includes(usage.featureKey)
  );
  const total = affectedUsage.reduce((sum, usage) => sum + usage.usageCountLast90Days, 0);
  if (total > 600) return 100;
  if (total > 240) return 75;
  if (total > 60) return 45;
  return affectedUsage.length > 0 ? 20 : 0;
}

function weightedScore(factors: Record<keyof RiskWeights, number>, weights: RiskWeights): number {
  const totalWeight = Object.values(weights).reduce((sum, value) => sum + value, 0);
  const raw = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + factors[key as keyof RiskWeights] * weight;
  }, 0);
  return clampScore(raw / totalWeight);
}

export function calculateChurnRiskScore(customer: Customer, scenario: Scenario, weights: RiskWeights, plans: Plan[]): number {
  const featureLoss = detectFeatureLoss(customer, scenario, plans).length;
  const criticalLoss = detectBusinessCriticalFeatureLoss(customer, scenario, plans).length;
  const { annualPriceDelta } = calculateCustomerPriceDelta(customer, scenario, plans);
  const priceIncreasePercent = customer.arr > 0 ? Math.max(0, annualPriceDelta / customer.arr) * 100 : 0;
  return weightedScore(
    {
      healthScoreWeight: calculateHealthScoreRisk(customer),
      supportTicketsWeight: calculateSupportBurdenRisk(customer),
      featureLossWeight: clampScore(featureLoss * 30),
      businessCriticalFeatureWeight: criticalLoss > 0 ? 100 : 0,
      priceIncreaseWeight: clampScore(priceIncreasePercent * 3),
      renewalProximityWeight: calculateRenewalProximityRisk(customer),
      contractRestrictionWeight: calculateContractRestrictionRisk(customer),
      enterpriseSegmentWeight: customer.segment === "Enterprise" ? 65 : customer.segment === "Mid-Market" ? 35 : 15,
      arrImpactWeight: customer.arr > 100000 ? 100 : customer.arr > 30000 ? 60 : 25,
      featureUsageWeight: calculateFeatureUsageRisk(customer, scenario)
    },
    weights
  );
}

export function calculateMigrationDifficultyScore(customer: Customer, scenario: Scenario, weights: RiskWeights, plans: Plan[]): number {
  const criticalLoss = detectBusinessCriticalFeatureLoss(customer, scenario, plans).length;
  return weightedScore(
    {
      healthScoreWeight: calculateHealthScoreRisk(customer) * 0.6,
      supportTicketsWeight: calculateSupportBurdenRisk(customer) * 0.7,
      featureLossWeight: clampScore(detectFeatureLoss(customer, scenario, plans).length * 35),
      businessCriticalFeatureWeight: criticalLoss > 0 ? 100 : 0,
      priceIncreaseWeight: clampScore(Math.max(0, calculateCustomerPriceDelta(customer, scenario, plans).annualPriceDelta / Math.max(customer.arr, 1)) * 220),
      renewalProximityWeight: calculateRenewalProximityRisk(customer),
      contractRestrictionWeight: calculateContractRestrictionRisk(customer),
      enterpriseSegmentWeight: customer.segment === "Enterprise" ? 80 : 25,
      arrImpactWeight: customer.arr > 100000 ? 80 : 35,
      featureUsageWeight: calculateFeatureUsageRisk(customer, scenario)
    },
    weights
  );
}

export function calculateRevenueImpactScore(customer: Customer, scenario: Scenario, weights: RiskWeights, plans: Plan[]): number {
  const churnRisk = calculateChurnRiskScore(customer, scenario, weights, plans);
  const arrWeight = customer.arr > 100000 ? 100 : customer.arr > 50000 ? 75 : customer.arr > 15000 ? 45 : 20;
  const priceDelta = calculateCustomerPriceDelta(customer, scenario, plans).annualPriceDelta;
  const upliftSensitivity = clampScore(Math.max(0, priceDelta / Math.max(customer.arr, 1)) * 300);
  return clampScore(arrWeight * 0.45 + churnRisk * 0.35 + upliftSensitivity * 0.2);
}

export function recommendCustomerAction(impact: Pick<CustomerImpact, "businessCriticalFeatureLossCount" | "churnRiskScore" | "migrationDifficultyScore" | "revenueImpactScore" | "monthlyPriceDelta" | "segment">): string {
  if (impact.businessCriticalFeatureLossCount > 0 && impact.churnRiskScore >= 70) return "Grandfather temporarily";
  if (impact.churnRiskScore >= 85 || impact.migrationDifficultyScore >= 85) return "Needs manual review";
  if (impact.segment === "Enterprise" && impact.revenueImpactScore >= 70) return "Notify Customer Success";
  if (impact.monthlyPriceDelta > 0 && impact.churnRiskScore >= 55) return "Offer discount";
  if (impact.businessCriticalFeatureLossCount > 0) return "Offer add-on";
  if (impact.churnRiskScore < 35) return "Migrate immediately";
  return "Grandfather temporarily";
}

function grandfatherApplies(customer: Customer, impact: CustomerImpact, scenario: Scenario): boolean {
  switch (scenario.grandfatheringRule) {
    case "Grandfather all existing customers":
      return true;
    case "Grandfather enterprise customers only":
      return customer.segment === "Enterprise";
    case "Grandfather customers near renewal":
      return calculateRenewalProximityRisk(customer) >= 75;
    case "Grandfather customers losing critical features":
      return impact.businessCriticalFeatureLossCount > 0;
    case "Grandfather high-risk accounts":
      return impact.churnRiskScore >= 70;
    default:
      return false;
  }
}

export function calculateProposedARR(customers: Customer[], scenario: Scenario, plans: Plan[], weights: RiskWeights = defaultRiskWeights): number {
  return buildCustomerImpacts(customers, scenario, plans, weights).reduce((sum, impact) => {
    const customer = customers.find((item) => item.id === impact.customerId);
    if (!customer) return sum;
    const grandfathered = grandfatherApplies(customer, impact, scenario);
    return sum + (grandfathered ? customer.arr : customer.arr + impact.annualPriceDelta);
  }, 0);
}

export function buildCustomerImpacts(customers: Customer[], scenario: Scenario, plans: Plan[], weights: RiskWeights = defaultRiskWeights): CustomerImpact[] {
  return customers
    .filter((customer) => scenario.affectedPlanIds.includes(customer.currentPlanId) || scenario.affectedPlanIds.includes(customer.currentPlanName))
    .map((customer) => {
      const lost = detectFeatureLoss(customer, scenario, plans);
      const criticalLost = lost.filter((feature) => feature.isBusinessCritical);
      const price = calculateCustomerPriceDelta(customer, scenario, plans);
      const churnRiskScore = calculateChurnRiskScore(customer, scenario, weights, plans);
      const migrationDifficultyScore = calculateMigrationDifficultyScore(customer, scenario, weights, plans);
      const revenueImpactScore = calculateRevenueImpactScore(customer, scenario, weights, plans);
      const overallImpactScore = clampScore(churnRiskScore * 0.42 + migrationDifficultyScore * 0.34 + revenueImpactScore * 0.24);
      const baseImpact = {
        customerId: customer.id,
        customerName: customer.companyName,
        segment: customer.segment,
        currentPlan: customer.currentPlanName,
        proposedPlan: price.proposedPlan.name,
        arr: customer.arr,
        renewalDate: customer.renewalDate,
        featureLossCount: lost.length,
        businessCriticalFeatureLossCount: criticalLost.length,
        lostFeatureNames: lost.map((feature) => feature.name),
        monthlyPriceDelta: price.monthlyPriceDelta,
        annualPriceDelta: price.annualPriceDelta,
        churnRiskScore,
        migrationDifficultyScore,
        revenueImpactScore,
        overallImpactScore
      };
      const recommendedAction = recommendCustomerAction(baseImpact);
      const explanation = explainImpact(customer, baseImpact, scenario);
      return { ...baseImpact, recommendedAction, explanation };
    });
}

export function compareMigrationStrategies(
  scenario: Scenario,
  customers: Customer[],
  plans: Plan[],
  weights: RiskWeights = defaultRiskWeights
): StrategyComparison[] {
  const impacts = buildCustomerImpacts(customers, scenario, plans, weights);
  const currentArr = calculateCurrentARR(customers);
  const strategies = [
    { name: "Immediate migration", retention: 0.72, grandfatherRate: 0.02, complexity: 35 },
    { name: "3-month phased migration", retention: 0.83, grandfatherRate: 0.12, complexity: 55 },
    { name: "6-month phased migration", retention: 0.9, grandfatherRate: 0.2, complexity: 70 },
    { name: "Grandfather all existing customers", retention: 0.97, grandfatherRate: 1, complexity: 45 },
    { name: "Grandfather enterprise customers only", retention: 0.91, grandfatherRate: 0.28, complexity: 58 },
    { name: "Grandfather customers near renewal", retention: 0.88, grandfatherRate: 0.22, complexity: 52 },
    { name: "Add-on pricing", retention: 0.86, grandfatherRate: 0.1, complexity: 65 },
    { name: "Discounted migration", retention: 0.89, grandfatherRate: 0.18, complexity: 60 }
  ];
  const grossUplift = impacts.reduce((sum, impact) => sum + Math.max(0, impact.annualPriceDelta), 0);
  return strategies
    .map((strategy) => {
      const grandfatheredCustomersCount = Math.round(impacts.length * strategy.grandfatherRate);
      const arrUplift = grossUplift * (1 - strategy.grandfatherRate) * strategy.retention;
      const highRiskCustomersCount = impacts.filter((impact) => impact.churnRiskScore >= 70).length;
      const revenueAtRisk = impacts.reduce((sum, impact) => sum + (impact.churnRiskScore >= 70 ? impact.arr * 0.18 : impact.arr * 0.04), 0) * (1 - strategy.retention);
      const recommendedScore = clampScore(strategy.retention * 45 + (arrUplift / Math.max(grossUplift, 1)) * 35 + (100 - strategy.complexity) * 0.2);
      return {
        strategyName: strategy.name,
        estimatedArr: Math.round(currentArr + arrUplift - revenueAtRisk),
        arrUplift: Math.round(arrUplift),
        revenueAtRisk: Math.round(revenueAtRisk),
        affectedCustomersCount: impacts.length,
        highRiskCustomersCount,
        grandfatheredCustomersCount,
        executionComplexity: strategy.complexity,
        recommendedScore
      };
    })
    .sort((a, b) => b.recommendedScore - a.recommendedScore);
}

export function generateSimulationSummary(result: SimulationResult): string {
  const risk = result.highRiskCustomersCount > 40 ? "high" : result.highRiskCustomersCount > 15 ? "moderate" : "manageable";
  return `PlanShift estimates ${currency(result.arrDelta)} in ARR delta across ${result.affectedCustomersCount} affected customers, with ${result.highRiskCustomersCount} high-risk accounts and a ${risk} migration risk profile.`;
}

export function generateImpactReport(result: SimulationResult): string {
  const topRisks = result.impacts
    .slice()
    .sort((a, b) => b.overallImpactScore - a.overallImpactScore)
    .slice(0, 5)
    .map((impact) => `- ${impact.customerName}: ${impact.overallImpactScore}/100 impact, ${impact.recommendedAction}. ${impact.explanation}`)
    .join("\n");
  return `# ${result.recommendation}

## Executive summary
${generateSimulationSummary(result)}

## Business objective
Increase monetization fairness by aligning advanced security and audit functionality with higher-value plans while protecting retention.

## Pricing change summary
The scenario changes packaging for affected plans and evaluates revenue uplift, feature loss, contract restrictions, renewal timing, and segment-level risk.

## Financial impact
- Current ARR: ${currency(result.currentArr)}
- Proposed ARR: ${currency(result.proposedArr)}
- Estimated uplift: ${currency(result.estimatedRevenueUplift)}
- Revenue at risk: ${currency(result.revenueAtRisk)}
- Grandfathering impact: ${currency(result.grandfatheringImpact)}

## Customer impact
- Affected customers: ${result.affectedCustomersCount}
- Customers losing feature access: ${result.customersLosingFeatureAccess}
- Customers near renewal: ${result.customersNearRenewal}
- Manual reviews: ${result.customersRequiringManualReview}

## Segment analysis
Enterprise accounts carry higher escalation impact. Mid-market accounts show the broadest packaging sensitivity. SMB accounts are mostly price-sensitive rather than feature-dependent.

## Top risk accounts
${topRisks}

## Grandfathering recommendation
Temporarily grandfather high-risk customers, especially enterprise and near-renewal accounts losing business-critical features.

## Migration strategy recommendation
Best balanced strategy: ${result.strategies[0]?.strategyName ?? "6-month phased migration"} with Customer Success outreach for high-risk accounts.

## Customer communication plan
Start with Customer Success previews for high-risk accounts, then send segmented product emails explaining value, timing, options, and renewal-specific terms.

## Success metrics
Track migrated-without-churn percentage, ARR uplift, escalations, add-on attach rate, support tickets, and renewal conversion.

## Risks and mitigations
Risk: perceived feature removal. Mitigation: phased migration, add-on option, and targeted grandfathering.

## Decision recommendation
Proceed with a phased migration and grandfathering rules for high-risk enterprise and near-renewal customers.

## Open questions
- Should security features be bundled only in Enterprise or offered as an add-on?
- What discount guardrails should Sales and Customer Success receive?
- Which customers require executive outreach?`;
}

export function runSimulation(
  scenario: Scenario,
  customers: Customer[],
  plans: Plan[],
  weights: RiskWeights = defaultRiskWeights
): SimulationResult {
  const impacts = buildCustomerImpacts(customers, scenario, plans, weights);
  const currentArr = calculateCurrentARR(customers);
  const proposedArr = calculateProposedARR(customers, scenario, plans, weights);
  const strategies = compareMigrationStrategies(scenario, customers, plans, weights);
  const revenueAtRisk = impacts.reduce((sum, impact) => sum + (impact.churnRiskScore >= 70 ? impact.arr * 0.22 : impact.arr * 0.035), 0);
  const discountImpact = scenario.discountStrategy === "No discount" ? 0 : impacts.reduce((sum, impact) => sum + Math.max(0, impact.annualPriceDelta) * 0.18, 0);
  const grandfatheringImpact = impacts.reduce((sum, impact) => {
    const customer = customers.find((item) => item.id === impact.customerId);
    return customer && grandfatherApplies(customer, impact, scenario) ? sum + Math.max(0, impact.annualPriceDelta) : sum;
  }, 0);
  const highRiskCustomersCount = impacts.filter((impact) => impact.churnRiskScore >= 70).length;
  const customersNearRenewal = impacts.filter((impact) => calculateRenewalProximityRisk(customers.find((customer) => customer.id === impact.customerId)!) >= 75).length;
  const arrDelta = proposedArr - currentArr - discountImpact;
  const resultWithoutReport = {
    scenarioId: scenario.id,
    currentArr,
    proposedArr: proposedArr - discountImpact,
    arrDelta,
    mrrDelta: arrDelta / 12,
    estimatedRevenueUplift: Math.max(0, arrDelta),
    revenueAtRisk: Math.round(revenueAtRisk),
    discountImpact: Math.round(discountImpact),
    grandfatheringImpact: Math.round(grandfatheringImpact),
    affectedCustomersCount: impacts.length,
    customersLosingFeatureAccess: impacts.filter((impact) => impact.featureLossCount > 0).length,
    customersGainingFeatureAccess: Math.round(impacts.length * 0.18),
    customersNeedingMigration: impacts.filter((impact) => !["Grandfather temporarily", "Needs manual review"].includes(impact.recommendedAction)).length,
    customersBlockedByContractTerms: impacts.filter((impact) => {
      const customer = customers.find((item) => item.id === impact.customerId);
      return customer ? calculateContractRestrictionRisk(customer) >= 100 : false;
    }).length,
    customersNearRenewal,
    customersRequiringManualReview: impacts.filter((impact) => impact.recommendedAction === "Needs manual review").length,
    highRiskCustomersCount,
    migrationReadinessScore: clampScore(100 - impacts.reduce((sum, impact) => sum + impact.migrationDifficultyScore, 0) / Math.max(impacts.length, 1)),
    supportEscalationRisk: clampScore(impacts.reduce((sum, impact) => sum + impact.churnRiskScore, 0) / Math.max(impacts.length, 1)),
    strategyConfidenceScore: strategies[0]?.recommendedScore ?? 74,
    recommendation: "Best balanced strategy: 6-month phased migration with grandfathering for high-risk enterprise customers.",
    impacts: impacts.sort((a, b) => b.overallImpactScore - a.overallImpactScore),
    strategies
  };
  return { ...resultWithoutReport, reportMarkdown: generateImpactReport(resultWithoutReport as SimulationResult) };
}

function explainImpact(customer: Customer, impact: Omit<CustomerImpact, "recommendedAction" | "explanation">, scenario: Scenario): string {
  const reasons: string[] = [];
  if (customer.segment === "Enterprise") reasons.push("enterprise escalation impact");
  if (customer.healthScore < 50) reasons.push(`health score of ${customer.healthScore}`);
  if (customer.supportTicketCountLast90Days > 5) reasons.push(`${customer.supportTicketCountLast90Days} support tickets in the last 90 days`);
  if (impact.businessCriticalFeatureLossCount > 0) reasons.push(`loss of ${impact.lostFeatureNames.join(", ")}`);
  if (impact.monthlyPriceDelta > 0) reasons.push(`${currency(impact.monthlyPriceDelta)} monthly price increase`);
  if (new Date(customer.renewalDate).getTime() - today.getTime() <= 60 * DAY_MS) reasons.push(`renewal on ${customer.renewalDate}`);
  if (customer.contract && !customer.contract.canChangePriceBeforeRenewal) reasons.push("contract prevents pre-renewal price changes");
  return reasons.length > 0
    ? `High risk factors include ${reasons.join(", ")} under "${scenario.name}".`
    : `Low disruption expected because feature dependency, renewal timing, support burden, and price movement are manageable.`;
}

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
