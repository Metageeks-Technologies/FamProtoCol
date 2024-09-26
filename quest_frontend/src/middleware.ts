import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  console.log("pahtname:-", pathname);
  console.log("search ", searchParams);
  // if (
  //   pathname !== "/" &&
  //   pathname !== "/user/referral/dashboard" &&
  //   !(pathname === "/" && searchParams.has("referralCode"))
  // ) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Exclude static files and assets
  ],
};
