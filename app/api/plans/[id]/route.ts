import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  monthlyPrice: z.coerce.number().nonnegative().optional(),
  annualPrice: z.coerce.number().nonnegative().optional(),
  supportLevel: z.string().min(1).optional(),
  usageLimits: z.record(z.union([z.string(), z.number()])).optional()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const plan = await prisma.plan.findFirst({ where: { id, organizationId: session.organizationId }, include: { features: { include: { feature: true } } } });
  return plan ? NextResponse.json(plan) : NextResponse.json({ error: "Plan not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan update" }, { status: 400 });
  const { id } = await params;
  return NextResponse.json(await prisma.plan.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.plan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
