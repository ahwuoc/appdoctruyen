import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email("Email không hợp lệ").nonempty("Vui lòng nhập email"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").nonempty("Vui lòng nhập mật khẩu"),
});

export type LoginInput = z.infer<typeof LoginSchema>;