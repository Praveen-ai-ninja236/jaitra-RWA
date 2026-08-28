import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const vendor = await db.getVendorContract(parseInt(params.id));
    if (!vendor) {
      return NextResponse.json({ error: "Vendor contract not found" }, { status: 404 });
    }
    return NextResponse.json(vendor);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await db.updateVendorContract(parseInt(params.id), body);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.deleteVendorContract(parseInt(params.id));
    return NextResponse.json({ message: "Vendor contract deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
