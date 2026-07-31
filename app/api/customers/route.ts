import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const customerSchema = z.object({
  externalCustomerId: z.string().min(1),
  companyName: z.string().min(1),
  segment: z.string().min(1),
  region: z.string().min(1),
  currentPlanId: z.string().optional(),
  mrr: z.coerce.number().nonnegative(),
  arr: z.coerce.number().nonnegative(),
  renewalDate: z.coerce.date(),
  contractType: z.string().min(1),
  customerSuccessOwner: z.string().min(1),
  healthScore: z.coerce.number().min(0).max(100),
  supportTicketCountLast90Days: z.coerce.number().int().nonnegative()
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = await prisma.customer.findMany({ where: { organizationId: session.organizationId }, take: 200, orderBy: { arr: "desc" } });
  return NextResponse.json(customers);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = customerSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid customer payload" }, { status: 400 });
  const customer = await prisma.customer.create({ data: { ...parsed.data, organizationId: session.organizationId } });
  return NextResponse.json(customer, { status: 201 });
}
