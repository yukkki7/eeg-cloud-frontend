import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { identifier, password } = await request.json();
  if (identifier === "xiberlinc" && password === "20250627") {
    return NextResponse.json({
      userId: "fake-user-1",
      token: "fake-jwt-token",
      expiresIn: 3600,
    });
  }
  return new Response(JSON.stringify({ error: "Invalid credentials" }), {
    status: 401,
  });
}
