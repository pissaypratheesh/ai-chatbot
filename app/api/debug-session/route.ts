import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: process.env.NODE_ENV !== "development",
    });

    return NextResponse.json({
      hasToken: !!token,
      token: token ? {
        id: token.id,
        email: token.email,
        type: token.type,
      } : null,
      cookies: request.headers.get("cookie"),
      userAgent: request.headers.get("user-agent"),
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to get session",
      details: (error as Error).message,
    }, { status: 500 });
  }
}
