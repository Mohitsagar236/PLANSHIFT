import { describe, expect, it } from "vitest";
import { customers, demoScenario, plans } from "@/lib/demo/data";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";
import {
  calculateContractRestrictionRisk,
  calculateCurrentARR,
  calculateCustomerPriceDelta,
  calculateHealthScoreRisk,
  calculateMigrationDifficultyScore,
  calculateProposedARR,
  calculateRenewalProximityRisk,
  calculateRevenueImpactScore,
  calculateSupportBurdenRisk,
  calculateChurnRiskScore,
  compareMigrationStrategies,
  detectBusinessCriticalFeatureLoss,
  detectFeatureLoss,
  generateImpactReport,
  recommendCustomerAction,
  runSimulation
} from "@/lib/simulation/engine";

const affectedCustomer = customers.find((customer) => customer.currentPlanName === "Pro" && customer.featureUsage.some((usage) => usage.featureKey === "sso"))!;

describe("simulation engine", () => {
  it("calculates current ARR", () => {
    expect(calculateCurrentARR(customers)).toBeGreaterThan(0);
  });

  it("calculates proposed ARR", () => {
    expect(calculateProposedARR(customers, demoScenario, plans, defaultRiskWeights)).toBeGreaterThan(0);
  });

  it("calculates price delta", () => {
    expect(calculateCustomerPriceDelta(affectedCustomer, demoScenario, plans).annualPriceDelta).toBeGreaterThan(0);
  });

  it("detects feature loss", () => {
    expect(detectFeatureLoss(affectedCustomer, demoScenario, plans).map((feature) => feature.key)).toContain("sso");
  });

  it("detects business-critical feature loss", () => {
    expect(detectBusinessCriticalFeatureLoss(affectedCustomer, demoScenario, plans).length).toBeGreaterThan(0);
  });

  it("scores renewal proximity risk", () => {
    expect(calculateRenewalProximityRisk({ ...affectedCustomer, renewalDate: "2026-08-15" })).toBeGreaterThan(70);
  });

  it("scores contract restriction risk", () => {
    expect(calculateContractRestrictionRisk({ ...affectedCustomer, contract: { ...affectedCustomer.contract!, canChangePriceBeforeRenewal: false } })).toBe(100);
  });

  it("scores health risk", () => {
    expect(calculateHealthScoreRisk({ ...affectedCustomer, healthScore: 44 })).toBeGreaterThan(70);
  });

  it("scores support burden risk", () => {
    expect(calculateSupportBurdenRisk({ ...affectedCustomer, supportTicketCountLast90Days: 8 })).toBeGreaterThan(60);
  });

  it("calculates churn risk score", () => {
    expect(calculateChurnRiskScore(affectedCustomer, demoScenario, defaultRiskWeights, plans)).toBeGreaterThan(0);
  });

  it("calculates migration difficulty score", () => {
    expect(calculateMigrationDifficultyScore(affectedCustomer, demoScenario, defaultRiskWeights, plans)).toBeGreaterThan(0);
  });

  it("calculates revenue impact score", () => {
    expect(calculateRevenueImpactScore(affectedCustomer, demoScenario, defaultRiskWeights, plans)).toBeGreaterThan(0);
  });

  it("recommends customer actions", () => {
    expect(recommendCustomerAction({ businessCriticalFeatureLossCount: 1, churnRiskScore: 80, migrationDifficultyScore: 75, revenueImpactScore: 80, monthlyPriceDelta: 100, segment: "Enterprise" })).toMatch(/Grandfather|manual/i);
  });

  it("compares strategies", () => {
    expect(compareMigrationStrategies(demoScenario, customers, plans, defaultRiskWeights)[0].recommendedScore).toBeGreaterThan(0);
  });

  it("generates a full simulation result", () => {
    const result = runSimulation(demoScenario, customers, plans, defaultRiskWeights);
    expect(result.impacts.length).toBeGreaterThan(0);
    expect(result.recommendation).toContain("Best balanced strategy");
  });

  it("generates an impact report", () => {
    const result = runSimulation(demoScenario, customers, plans, defaultRiskWeights);
    expect(generateImpactReport(result)).toContain("Executive summary");
  });
});
