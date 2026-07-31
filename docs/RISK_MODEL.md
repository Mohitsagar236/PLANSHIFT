# Risk Model

Risk factors include health score, support burden, feature loss, business-critical feature loss, price increase, renewal proximity, contract restriction, enterprise segment impact, ARR impact, and feature usage intensity.

Each factor is scored from 0 to 100 and combined with configurable weights. Churn risk, migration difficulty, and revenue impact are calculated separately, then blended into an overall impact score. Every customer impact includes a human-readable explanation.

Example: an enterprise customer with health score 44, SSO dependency, renewal in 42 days, contract restrictions, and a price increase receives a high churn and migration difficulty score.

Limitations: weights should be calibrated with historical churn, support escalation, and renewal data before enterprise deployment.
