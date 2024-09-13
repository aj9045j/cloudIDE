import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const ispublicUrl = path === '/login' || path === '/signup';
    

    const cookie = request.cookies.get('token')?.value || '';
    
    if (!ispublicUrl && !cookie) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    if (ispublicUrl && cookie) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    return NextResponse.next();

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/", "/login", "/signup", "/profile"],
};
