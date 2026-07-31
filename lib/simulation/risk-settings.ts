import type { RiskWeights } from "@/lib/types";

export const defaultRiskWeights: RiskWeights = {
  healthScoreWeight: 15,
  supportTicketsWeight: 10,
  featureLossWeight: 12,
  businessCriticalFeatureWeight: 18,
  priceIncreaseWeight: 12,
  renewalProximityWeight: 10,
  contractRestrictionWeight: 8,
  enterpriseSegmentWeight: 6,
  arrImpactWeight: 5,
  featureUsageWeight: 4
};

export function normalizeWeights(weights: RiskWeights): RiskWeights {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return defaultRiskWeights;
  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, Math.max(0, Math.round((value / total) * 100))])
  ) as RiskWeights;
}
