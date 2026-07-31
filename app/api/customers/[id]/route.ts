import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  companyName: z.string().min(1).optional(),
  segment: z.string().min(1).optional(),
  region: z.string().min(1).optional(),
  arr: z.coerce.number().nonnegative().optional(),
  healthScore: z.coerce.number().min(0).max(100).optional(),
  supportTicketCountLast90Days: z.coerce.number().int().nonnegative().optional()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const customer = await prisma.customer.findFirst({ where: { id, organizationId: session.organizationId }, include: { featureUsage: { include: { feature: true } }, contract: true } });
  return customer ? NextResponse.json(customer) : NextResponse.json({ error: "Customer not found" }, { status: 404 });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid customer update" }, { status: 400 });
  const { id } = await params;
  return NextResponse.json(await prisma.customer.update({ where: { id }, data: parsed.data }));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.customer.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
