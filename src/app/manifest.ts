import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "App Đọc Truyện Online",
    short_name: "AppDocTruyen",
    description: "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất Manga, Manhwa, Manhua.",
    start_url: "/",
    display: "standalone",
    background_color: "#151d35",
    theme_color: "#151d35",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
