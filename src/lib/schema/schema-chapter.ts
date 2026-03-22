import { z } from "zod";

export const chapterSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề chương"),
  content: z.string().optional(),
  order_sort: z.number().optional(),
  imageFiles: z.array(z.any()).optional(),
  imageUrls: z.array(z.string()).optional(),
});

export type ChapterInput = z.infer<typeof chapterSchema>;
