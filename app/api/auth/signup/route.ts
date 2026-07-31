import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setSession, signupSchema } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid signup request" }, { status: 400 });
  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const organization = await prisma.organization.create({
    data: {
      name: parsed.data.organizationName,
      users: {
        create: {
          name: parsed.data.name,
          email: parsed.data.email,
          passwordHash,
          role: parsed.data.role
        }
      },
      riskWeights: { create: {} }
    },
    include: { users: true }
  });
  const user = organization.users[0];
  await setSession(user.id, organization.id, user.role);
  return NextResponse.json({ ok: true, redirectTo: "/dashboard" }, { status: 201 });
}
