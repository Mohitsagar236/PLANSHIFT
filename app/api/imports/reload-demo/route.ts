import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ ok: true, message: "Run npm.cmd run db:seed to reload the database demo dataset." });
}
