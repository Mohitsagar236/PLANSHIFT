import { NextResponse } from "next/server";
import { customers, demoScenario, plans } from "@/lib/demo/data";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";
import { runSimulation } from "@/lib/simulation/engine";

export async function POST() {
  return NextResponse.json(runSimulation(demoScenario, customers, plans, defaultRiskWeights));
}
