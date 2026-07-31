import { NextResponse } from "next/server";
import { z } from "zod";
import { customers, demoScenario, plans } from "@/lib/demo/data";
import { runSimulation } from "@/lib/simulation/engine";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";

const scenarioSchema = z.object({
  id: z.string().default("custom-scenario"),
  name: z.string().min(1),
  description: z.string().default(""),
  pricingChangeType: z.string().default("Move feature to higher plan"),
  affectedPlanIds: z.array(z.string()).default(["Pro"]),
  proposedPlanIds: z.array(z.string()).default(["Business"]),
  affectedFeatureIds: z.array(z.string()).default(["sso", "advanced_audit_logs"]),
  migrationStartDate: z.string().default("2026-09-01"),
  migrationEndDate: z.string().default("2027-03-01"),
  grandfatheringRule: z.string().default("Grandfather high-risk accounts"),
  revenueAssumption: z.string().default("Map affected accounts to proposed plans."),
  churnRiskAssumption: z.string().default("Risk is driven by feature loss and pricing movement."),
  discountStrategy: z.string().default("Temporary discount"),
  notes: z.string().default("")
});

export async function GET() {
  return NextResponse.json([{ ...demoScenario, result: runSimulation(demoScenario, customers, plans, defaultRiskWeights) }]);
}

export async function POST(request: Request) {
  const parsed = scenarioSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid simulation scenario" }, { status: 400 });
  return NextResponse.json(runSimulation(parsed.data as typeof demoScenario, customers, plans, defaultRiskWeights), { status: 201 });
}
