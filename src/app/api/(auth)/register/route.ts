import { NextResponse, NextRequest } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { STATUS_Response } from "@/lib/status";
import { RegisterInput, registerSchema } from "../../../schema/schema-register";

export const POST = async (request: NextRequest) =>
{
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                {
                    message: "Dữ liệu không hợp lệ",
                    error: result.error.issues.map((issue) => issue.message).join(", "),
                },
                { status: STATUS_Response.BAD_REQUEST }
            );
        }
        const { email, password, name, confirmPassword } = result.data as RegisterInput;
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        if (!data) {
            return NextResponse.json(
                { message: "Đăng ký thất bại", error: "Email đã tồn tại" },
                { status: STATUS_Response.BAD_REQUEST }
            );
        }
        if (error) {
            return NextResponse.json(
                { message: "Đăng ký thất bại", error: error.message },
                { status: STATUS_Response.BAD_REQUEST }
            );
        } return NextResponse.json(
            { message: "Đăng ký thành công" },
            { status: STATUS_Response.SUCCESS }
        );
    } catch (error) {
        if (error) {
            return NextResponse.json(
                { message: "Đăng ký thất bại", error },
                { status: STATUS_Response.BAD_REQUEST }
            );
        }
    }
};
