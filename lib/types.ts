export type Segment = "SMB" | "Mid-Market" | "Enterprise";

export type PlanType = "CURRENT" | "PROPOSED";

export type Customer = {
  id: string;
  externalCustomerId: string;
  companyName: string;
  segment: Segment;
  region: string;
  currentPlanId: string;
  currentPlanName: string;
  mrr: number;
  arr: number;
  renewalDate: string;
  contractType: string;
  customerSuccessOwner: string;
  healthScore: number;
  supportTicketCountLast90Days: number;
  contract?: Contract;
  featureUsage: FeatureUsage[];
};

export type Plan = {
  id: string;
  planType: PlanType;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  usageLimits: Record<string, number | string>;
  supportLevel: string;
  featureKeys: string[];
};

export type Feature = {
  id: string;
  key: string;
  name: string;
  description: string;
  category: string;
  isBusinessCritical: boolean;
};

export type FeatureUsage = {
  featureId: string;
  featureKey: string;
  featureName: string;
  usageCountLast30Days: number;
  usageCountLast90Days: number;
  isBusinessCritical: boolean;
};

export type Contract = {
  renewalDate: string;
  contractEndDate: string;
  discountPercentage: number;
  customTerms: string;
  canChangePriceBeforeRenewal: boolean;
};

export type RiskWeights = {
  healthScoreWeight: number;
  supportTicketsWeight: number;
  featureLossWeight: number;
  businessCriticalFeatureWeight: number;
  priceIncreaseWeight: number;
  renewalProximityWeight: number;
  contractRestrictionWeight: number;
  enterpriseSegmentWeight: number;
  arrImpactWeight: number;
  featureUsageWeight: number;
};

export type PricingChangeType =
  | "Move feature to higher plan"
  | "Increase plan price"
  | "Decrease plan price"
  | "Create add-on"
  | "Remove feature from plan"
  | "Introduce usage-based pricing"
  | "Grandfather existing customers"
  | "Custom migration rule";

export type GrandfatheringRule =
  | "No grandfathering"
  | "Grandfather all existing customers"
  | "Grandfather enterprise customers only"
  | "Grandfather customers near renewal"
  | "Grandfather customers losing critical features"
  | "Grandfather high-risk accounts"
  | "Custom rule";

export type DiscountStrategy =
  | "No discount"
  | "Temporary discount"
  | "Segment-based discount"
  | "Renewal-based discount"
  | "Manual discount";

export type Scenario = {
  id: string;
  name: string;
  description: string;
  pricingChangeType: PricingChangeType;
  affectedPlanIds: string[];
  proposedPlanIds: string[];
  affectedFeatureIds: string[];
  migrationStartDate: string;
  migrationEndDate: string;
  grandfatheringRule: GrandfatheringRule;
  revenueAssumption: string;
  churnRiskAssumption: string;
  discountStrategy: DiscountStrategy;
  notes: string;
};

export type CustomerImpact = {
  customerId: string;
  customerName: string;
  segment: Segment;
  currentPlan: string;
  proposedPlan: string;
  arr: number;
  renewalDate: string;
  featureLossCount: number;
  businessCriticalFeatureLossCount: number;
  lostFeatureNames: string[];
  monthlyPriceDelta: number;
  annualPriceDelta: number;
  churnRiskScore: number;
  migrationDifficultyScore: number;
  revenueImpactScore: number;
  overallImpactScore: number;
  recommendedAction: string;
  explanation: string;
};

export type StrategyComparison = {
  strategyName: string;
  estimatedArr: number;
  arrUplift: number;
  revenueAtRisk: number;
  affectedCustomersCount: number;
  highRiskCustomersCount: number;
  grandfatheredCustomersCount: number;
  executionComplexity: number;
  recommendedScore: number;
};

export type SimulationResult = {
  scenarioId: string;
  currentArr: number;
  proposedArr: number;
  arrDelta: number;
  mrrDelta: number;
  estimatedRevenueUplift: number;
  revenueAtRisk: number;
  discountImpact: number;
  grandfatheringImpact: number;
  affectedCustomersCount: number;
  customersLosingFeatureAccess: number;
  customersGainingFeatureAccess: number;
  customersNeedingMigration: number;
  customersBlockedByContractTerms: number;
  customersNearRenewal: number;
  customersRequiringManualReview: number;
  highRiskCustomersCount: number;
  migrationReadinessScore: number;
  supportEscalationRisk: number;
  strategyConfidenceScore: number;
  recommendation: string;
  impacts: CustomerImpact[];
  strategies: StrategyComparison[];
  reportMarkdown: string;
};
