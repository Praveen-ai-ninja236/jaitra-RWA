import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deleteAttachment(parseInt(params.id));
    return NextResponse.json({ message: "Attachment deleted" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
