import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// =============Const Const============
export const protectedRoutes = ['/dashboard', '/profile'];
export const authRoutes = ['/login', '/register'];
// ===============End Const==================


export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get: (key) => request.cookies.get(key)?.value,
            },
        }
    );

    const { data: { user }, error } = await supabase.auth.getUser();
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );
    if (isProtectedRoute && (!user || error)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
    const isAuthRoute = authRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    if (isAuthRoute && user) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [

        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};