import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    if (format === "list") {
      const list = await db.getDropdownSettingsList();
      return NextResponse.json(list);
    }

    const map = await db.getAllDropdownSettings();
    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category_key, option_value, sort_order } = body;

    if (!category_key || !option_value) {
      return NextResponse.json(
        { error: "category_key and option_value are required" },
        { status: 400 }
      );
    }

    const newOpt = await db.addDropdownOption(category_key, option_value, sort_order || 0);
    return NextResponse.json(newOpt, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
