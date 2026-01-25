import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Return user without password
    const { password: _, ...safeUser } = user;

    return NextResponse.json({
      user: safeUser,
      token: Buffer.from(`${user.id}:${Date.now()}`).toString("base64"),
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
