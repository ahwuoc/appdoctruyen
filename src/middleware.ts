import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type Cookie = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

// ============= Tuyến đường cần bảo vệ ============
export const protectedRoutes = ["/dashboard", "/profile", "/manager"];
export const authRoutes = ["/login", "/register"];
export const managerOnlyRoutes = ["/manager"];
// ===============================================

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet: Cookie[]) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && (!user || error)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isManagerRoute = managerOnlyRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isManagerRoute && user) {
    const role = user.user_metadata?.role || "USER";
    console.warn("role", role);

    if (role === "USER") {
      console.warn(`[Middleware] Chặn truy cập trái phép: User ${user.email} đang cố vào /manager`);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // 3. Đã đăng nhập rồi thì không vào lại trang Login/Register
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
