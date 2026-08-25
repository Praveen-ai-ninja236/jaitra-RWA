import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await db.updateFestivalExpenseStatus(parseInt(params.id), body.approval_status, body.approver_name);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
