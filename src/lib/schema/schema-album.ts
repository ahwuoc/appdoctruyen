
import { z } from 'zod';

export const albumSchema = z.object({
    title: z.string().min(1, "Tên album không được để trống"),
    content: z.string().optional(),
    categoryIds: z.number().array(),
    imageFile: z.instanceof(File).optional(),
});

export type AlbumInput = z.infer<typeof albumSchema>;