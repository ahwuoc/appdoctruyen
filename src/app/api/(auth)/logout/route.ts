import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const POST = async (request: NextRequest) => {
    try {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            }
        );

        const { error } = await supabase.auth.signOut();

        if (error) {
            return NextResponse.json(
                {
                    message: "Đăng xuất thất bại",
                    error: error.message
                },
                { status: 500 }
            );
        }

        const response = NextResponse.json({
            message: "Đăng xuất thành công"
        }, {
            status: 200
        });

        cookieStore.delete("sb-access-token");
        cookieStore.delete("sb-refresh-token");

        return response;

    } catch (error) {
        console.error("Lỗi trong quá trình đăng xuất:", error);
        return NextResponse.json(
            {
                message: "Lỗi máy chủ khi đăng xuất",
                error: error instanceof Error ? error.message : "Lỗi không xác định"
            },
            { status: 500 }
        );
    }
};