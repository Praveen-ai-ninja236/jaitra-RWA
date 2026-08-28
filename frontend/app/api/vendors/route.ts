import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const functionalStatus = searchParams.get("functional_status") || undefined;
    const verificationStatus = searchParams.get("verification_status") || undefined;

    const vendors = await db.getVendorContracts(category, functionalStatus, verificationStatus);
    return NextResponse.json(vendors);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.vendor_name || !body.category) {
      return NextResponse.json(
        { error: "vendor_name and category are required" },
        { status: 400 }
      );
    }
    const newVendor = await db.createVendorContract(body);
    return NextResponse.json(newVendor, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
