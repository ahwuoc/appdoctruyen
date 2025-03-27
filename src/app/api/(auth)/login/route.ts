import { NextResponse, NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { STATUS_Response } from "@/lib/status";
import { LoginSchema, LoginInput } from "../../../schema/schema-login";

export const POST = async (request: NextRequest) => {
    try {
        console.log("chay toi day")
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        const body = await request.json();
        const validation = LoginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    message: "Dữ liệu không hợp lệ",
                    errors: validation.error.issues.map(issue => issue.message),
                },
                { status: STATUS_Response.BAD_REQUEST }
            );
        }

        const { email, password } = validation.data as LoginInput;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            const errorMessage = error.message.includes("Email not confirmed")
                ? "Email chưa được xác nhận. Vui lòng kiểm tra email để kích hoạt tài khoản."
                : "Email hoặc mật khẩu không đúng.";

            return NextResponse.json(
                { message: errorMessage, error: error.message },
                { status: STATUS_Response.UNAUTHORIZED }
            );
        }

        const response = NextResponse.json(
            {
                message: "Đăng nhập thành công",
                user: data.user,
            },
            { status: STATUS_Response.SUCCESS }
        );

        if (data.session) {
            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
            };
            response.cookies.set("sb-access-token", data.session.access_token, cookieOptions);
            response.cookies.set("sb-refresh-token", data.session.refresh_token, cookieOptions);
        }
        return response;

    } catch (error) {
        console.error("Lỗi xử lý đăng nhập:", error);
        return NextResponse.json(
            {
                message: "Lỗi máy chủ nội bộ",
                error: error instanceof Error ? error.message : "Lỗi không xác định",
            },
            { status: STATUS_Response.INTERNAL_SERVER_ERROR }
        );
    }
};