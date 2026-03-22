export const siteConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "qttruyen",
  description: "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất Manga, Manhwa, Manhua.",
  logo: process.env.NEXT_PUBLIC_APP_LOGO || "/logo.png",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://appdoctruyen.id.vn",
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "/og-image.jpg",

  keywords: [
    "đọc truyện tranh",
    "manga",
    "manhwa",
    "manhua",
    "truyện tranh online",
  ],

  links: {
    facebook: "",
    github: "",
  },
};