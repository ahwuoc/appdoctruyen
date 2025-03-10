// import { NextResponse, NextRequest } from 'next/server';

// import { supabase } from '@/lib/supabaseClient';
// const protectedRoutes = ['/dashboard', '/profile', '/setting', '/admin'];
// export  async function middleware(req: NextRequest)
// {
//     const token = req.cookies.get('sb-access-token')?.value;

//     const pathname = req.nextUrl.pathname;

//     const isProtected = protectedRoutes.some((router) => pathname === router || pathname.startsWith(`${router}/`));

//     if (isProtected && !token) {
//         return NextResponse.redirect('/');

//     }
//     return NextResponse.next();
// }
// export const config = [
//   {
//     matcher: ['/api/*'],
//     middleware: [middleware],
//   },
// ]