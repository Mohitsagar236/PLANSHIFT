import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const planSchema = z.object({
  planType: z.enum(["CURRENT", "PROPOSED"]),
  name: z.string().min(1),
  monthlyPrice: z.coerce.number().nonnegative(),
  annualPrice: z.coerce.number().nonnegative(),
  usageLimits: z.record(z.union([z.string(), z.number()])),
  supportLevel: z.string().min(1)
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await prisma.plan.findMany({ where: { organizationId: session.organizationId }, include: { features: true } }));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = planSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan payload" }, { status: 400 });
  return NextResponse.json(await prisma.plan.create({ data: { ...parsed.data, organizationId: session.organizationId } }), { status: 201 });
}
