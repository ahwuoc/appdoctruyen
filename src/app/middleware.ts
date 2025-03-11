// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from '../lib/supabaseClient';

// export function middleware(request: NextRequest)
// {
//     {
//         const { data: { session } } = await supabase.auth.getSession();

//         if (session || req.nextUrl.pathname === "/login") {
//             return NextResponse.redirect(new URL("/", req.url));
//         }

//         return NextResponse.next();
//     }
// }

// export const config = {
//     matcher: [
//         "/profile/:path*",
//     ],
// };
