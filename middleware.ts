import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define the paths that should not require authentication
const publicPaths = ["/", "/api/auth", "/api/auth/callback/credentials"]; // Add the NextAuth routes and root route

export async function middleware(req: NextRequest) {
  // Get the JWT token if it exists
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const { pathname } = req.nextUrl;

  // // Check if the path is public
  // const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // // Check if the path is public
  const isPublicPath = publicPaths.includes(path);

  console.log(isPublicPath);

  // If the user is not logged in and the route is not public, redirect them to "/"
  if (!token && !isPublicPath) {
    console.log("Hello there");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If the user is logged in and tries to access "/", redirect them to "/dashboard"
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow access if the path is public or the user is authenticated
  return NextResponse.next();
}

// Specify which paths to apply the middleware to
export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"], // Exclude NextAuth routes and static files
};
