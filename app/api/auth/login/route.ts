import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { credentialsSchema, setSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = credentialsSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid login request" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
  await setSession(user.id, user.organizationId, user.role);
  return NextResponse.json({ ok: true, redirectTo: "/dashboard" });
}
