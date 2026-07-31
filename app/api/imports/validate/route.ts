import { NextResponse } from "next/server";
import { z } from "zod";
import { validateCsv, csvSchemas } from "@/lib/csv/validators";

const requestSchema = z.object({
  type: z.enum(Object.keys(csvSchemas) as [keyof typeof csvSchemas, ...Array<keyof typeof csvSchemas>]),
  csvText: z.string().min(1)
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid CSV validation request" }, { status: 400 });
  return NextResponse.json(validateCsv(parsed.data.type, parsed.data.csvText));
}
