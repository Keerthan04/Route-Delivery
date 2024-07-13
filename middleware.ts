import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'; // Import JwtPayload type
export function checkAuth(req: NextRequest) {
  const token = req.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET_KEY!) as JwtPayload; // Add type assertion
    if (!decoded.login) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
