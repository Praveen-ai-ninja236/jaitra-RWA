import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { option_value, is_active, sort_order } = body;
    const updated = await db.updateDropdownOption(
      parseInt(params.id),
      option_value,
      is_active,
      sort_order
    );
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deleteDropdownOption(parseInt(params.id));
    return NextResponse.json({ message: "Dropdown option deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
