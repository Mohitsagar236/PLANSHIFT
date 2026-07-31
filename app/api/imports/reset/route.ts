import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, message: "Run npm.cmd run db:reset-demo to clear and reseed demo data." });
}
