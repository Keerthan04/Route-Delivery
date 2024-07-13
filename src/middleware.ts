import { NextRequest, NextResponse } from "next/server";

// Define middleware function
export async function middleware(request: NextRequest) {
  try {
    const cookie = request.cookies.get("token");
    const path = new URL(request.url).pathname;

    // If trying to access /home or its sub-paths without a token, redirect to /
    if (path.startsWith("/home") && !cookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If trying to access / with a token, redirect to /home
    if (path === "/" && cookie) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    // Proceed to next middleware or handler
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.error();
  }
}

// Configuration object for matcher
export const config = {
  // Define paths to apply middleware to
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)", // Exclude specific paths
  ],
};
