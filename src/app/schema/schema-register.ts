import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().nonempty("Tên không được để trống"),
    email: z.string().trim().email("Email không hợp lệ"),
    password: z.string().trim().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().trim().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"], 
});

export type RegisterInput = z.infer<typeof registerSchema>;