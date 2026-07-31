# Data Model

Core models include `Organization`, `User`, `Customer`, `Plan`, `Feature`, `PlanFeature`, `FeatureUsage`, `Contract`, `SimulationScenario`, `SimulationResult`, `CustomerImpact`, `StrategyComparison`, `ImportBatch`, `ImportError`, `RiskWeightSetting`, and `Report`.

Plans are separated by `CURRENT` and `PROPOSED`. Feature usage connects customers to features and drives feature-loss and dependency risk. Scenarios store affected plans/features, migration dates, grandfathering rules, revenue assumptions, churn assumptions, and discount strategy.
