import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await db.updateCulturalAgenda(parseInt(params.id), body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deleteCulturalAgenda(parseInt(params.id));
    return NextResponse.json({ message: "Agenda item removed" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
