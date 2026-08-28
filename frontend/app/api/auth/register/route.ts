import { NextRequest, NextResponse } from "next/server";
import * as db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, tower, flat_no, phone } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const newUser = await db.registerUser({
      name,
      email,
      password,
      role: role || "User",
      tower,
      flat_no,
      phone,
    });

    return NextResponse.json({ user: newUser, message: "Registration successful" }, { status: 201 });
  } catch (err: any) {
    if (err.message && err.message.includes("unique")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
