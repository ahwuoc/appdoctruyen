import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { STATUS_Response } from "@/lib/status";
import { LoginSchema, LoginInput } from "../../../schema/schema-login";

export const POST = async (request: NextRequest) =>
{
    try {
        const body = await request.json();
        const result = LoginSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Dữ liệu không hợp lệ",
                    error: result.error.issues.map((issue) => issue.message).join(", ")
                },
                { status: STATUS_Response.BAD_REQUEST }
            );
        }

        const { email, password } = result.data as LoginInput;

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            let errorMessage = "Email hoặc mật khẩu không đúng.";
            if (error.message.includes("Email not confirmed")) {
                errorMessage = "Email chưa được xác nhận. Vui lòng kiểm tra email để kích hoạt tài khoản.";
            }
            return NextResponse.json(
                { message: errorMessage, error: error.message },
                { status: STATUS_Response.UNAUTHORIZED }
            );
        }

        return NextResponse.json(
            {
                message: "Đăng nhập thành công",
                user: data.user,
                token: data.session?.access_token
            },
            { status: STATUS_Response.SUCCESS }
        );

    } catch (error) {
        console.error("Lỗi xử lý request:", error);

        return NextResponse.json(
            {
                message: "Lỗi máy chủ nội bộ",
                error: error instanceof Error ? error.message : "Unknown error"
            },
            { status: STATUS_Response.INTERNAL_SERVER_ERROR }
        );
    }
};
