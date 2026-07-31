import { NextResponse } from "next/server";
import { demoResult } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({ title: "PlanShift Pricing Change Impact Report", markdownContent: demoResult.reportMarkdown });
}
