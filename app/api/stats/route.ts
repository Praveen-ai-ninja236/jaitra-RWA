import { NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET() {
  try {
    const stats = await db.getStats();
    return NextResponse.json(stats);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
