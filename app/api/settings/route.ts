import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultRiskWeights } from "@/lib/simulation/risk-settings";

const weightsSchema = z.object(Object.fromEntries(Object.keys(defaultRiskWeights).map((key) => [key, z.coerce.number().int().min(0).max(100)])) as Record<keyof typeof defaultRiskWeights, z.ZodNumber>);

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(defaultRiskWeights);
  return NextResponse.json((await prisma.riskWeightSetting.findUnique({ where: { organizationId: session.organizationId } })) ?? defaultRiskWeights);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = weightsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid risk weights" }, { status: 400 });
  const weights = await prisma.riskWeightSetting.upsert({
    where: { organizationId: session.organizationId },
    create: { organizationId: session.organizationId, ...parsed.data },
    update: parsed.data
  });
  return NextResponse.json(weights);
}
