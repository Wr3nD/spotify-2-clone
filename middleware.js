import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    //TOKEN will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname, origin } = req.nextUrl;
    //allow the request if the following is true
    // 1. its a request for next-auth session & provider fetching
    // 2. the token exists
    if (pathname.includes("/api/auth") || token) {
        return NextResponse.next();
    }
    // redirect them to login if they dont have token AND are requesting a protected route
    const redirectUrl = origin + "/login";
    console.log("NAME", pathname);
    if (!token && pathname !== "/login") {
        console.log("REDIRECT", redirectUrl);
        return NextResponse.redirect(redirectUrl);
    }
}

export const config = {
    matcher: "/",
};
