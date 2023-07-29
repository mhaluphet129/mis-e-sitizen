import { NextRequest, NextResponse } from "next/server";

export async function middleware(req = NextRequest) {
  const url = req.nextUrl.clone();
  const validPath = ["/", "/user/login", "/user/home", "user/barangay-home"];
  if (validPath.includes(url.pathname)) {
    const isLoggedIn = req.cookies["loggedIn"] || false;
    const barangay = req.cookies["barangay"] != "false" || false;
    url.pathname = `/${
      isLoggedIn && barangay
        ? "user/barangay-home"
        : isLoggedIn && !barangay
        ? "user/home"
        : "user/login"
    }`;
    return NextResponse.rewrite(url);
  }
}
