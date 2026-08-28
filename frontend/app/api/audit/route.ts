import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const transactions = await db.getAllTransactions();
    return NextResponse.json(transactions);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
