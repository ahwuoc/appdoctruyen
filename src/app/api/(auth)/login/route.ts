import { NextResponse, NextRequest } from "next/server";
import { createServerClient, CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { LoginSchema, LoginInput } from "@/lib/schema/schema-login";
import { STATUS_Response } from "@/app/utils/types/status";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const loginWithSupabase = async (credentials: LoginInput) => {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options: supabaseOptions }) => {
            const nextJsCookieOptions: Partial<ResponseCookie> = {
              httpOnly: supabaseOptions?.httpOnly ?? false,
              secure:
                supabaseOptions?.secure ??
                process.env.NODE_ENV === "production",
              path: supabaseOptions?.path ?? "/",
              sameSite: supabaseOptions?.sameSite ?? "lax",
              maxAge: supabaseOptions?.maxAge,
              expires: supabaseOptions?.expires
                ? new Date(supabaseOptions.expires)
                : undefined,
              domain: supabaseOptions?.domain,
            };
            cookieStore.set(name, value, nextJsCookieOptions);
          });
        },
      },
    }
  );

  const { email, password } = credentials;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMessage = error.message.includes("Email not confirmed")
      ? "Email chưa được xác nhận. Vui lòng kiểm tra email."
      : "Email hoặc mật khẩu không đúng.";

    return { success: false, message: errorMessage, error };
  }

  return { success: true, user: data.user, session: data.session };
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Dữ liệu không hợp lệ",
          errors: validation.error.issues.map((i) => i.message),
        },
        { status: STATUS_Response.BAD_REQUEST }
      );
    }
    const result = await loginWithSupabase(validation.data);
    if (!result.success) {
      return NextResponse.json(
        { message: result.message, error: result.error?.message },
        { status: STATUS_Response.UNAUTHORIZED }
      );
    }

    const response = NextResponse.json(
      { message: "Đăng nhập thành công", user: result.user },
      { status: STATUS_Response.SUCCESS }
    );

    if (result.session) {
      const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
      };
      response.cookies.set(
        "sb-access-token",
        result.session.access_token,
        cookieOptions
      );
      response.cookies.set(
        "sb-refresh-token",
        result.session.refresh_token,
        cookieOptions
      );
    }

    return response;
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return NextResponse.json(
      {
        message: "Lỗi máy chủ nội bộ",
        error: error instanceof Error ? error.message : "Lỗi không xác định",
      },
      { status: STATUS_Response.INTERNAL_SERVER_ERROR }
    );
  }
};
