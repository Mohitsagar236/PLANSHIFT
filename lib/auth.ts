import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signupSchema = credentialsSchema.extend({
  name: z.string().min(2),
  organizationName: z.string().min(2),
  role: z.enum(["ADMIN", "PRODUCT_MANAGER", "VIEWER"]).default("PRODUCT_MANAGER")
});

const cookieName = "planshift_session";

function secret() {
  return process.env.AUTH_SECRET ?? "planshift-development-secret-change-me";
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, organizationId: string, role: string) {
  const payload = Buffer.from(JSON.stringify({ userId, organizationId, role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token?: string) {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const ok = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!ok) return null;
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    userId: string;
    organizationId: string;
    role: string;
    exp: number;
  };
  return data.exp > Date.now() ? data : null;
}

export async function getSession() {
  const store = await cookies();
  return verifySessionToken(store.get(cookieName)?.value);
}

export async function setSession(userId: string, organizationId: string, role: string) {
  const store = await cookies();
  store.set(cookieName, createSessionToken(userId, organizationId, role), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(cookieName);
}
