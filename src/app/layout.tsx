import { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const roboto = Roboto({ 
  subsets: ["latin", "vietnamese"], 
  weight: ["300", "400", "500", "700", "900"],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#151d35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: "App Đọc Truyện Online - Manga, Manhwa, Manhua Miễn Phí",
    template: "%s | App Đọc Truyện",
  },
  description: "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại. Tốc độ load nhanh, không quảng cáo.",
  keywords: ["đọc truyện tranh", "manga online", "truyện tranh", "manhwa", "manhua", "truyện mới cập nhật", "truyện hay"],
  authors: [{ name: "AppDocTruyen Team" }],
  creator: "AppDocTruyen Team",
  publisher: "AppDocTruyen Team",
  metadataBase: new URL('https://appdoctruyen.id.vn'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://appdoctruyen.id.vn",
    title: "App Đọc Truyện Online - Manga, Manhwa, Manhua Miễn Phí",
    description: "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại.",
    siteName: "AppDocTruyen",
    images: [
      {
        url: "/logo-white.png",
        width: 1200,
        height: 630,
        alt: "App Đọc Truyện Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "App Đọc Truyện Online - Manga, Manhwa, Manhua Miễn Phí",
    description: "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất.",
    images: ["/logo-white.png"],
  },
  verification: {
    google: "google-site-verification-id", // User can update this
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "App Đọc Truyện Online",
    "url": "https://appdoctruyen.id.vn",
    "description": "Trang web đọc truyện tranh online miễn phí cập nhật mới nhất Manga, Manhwa, Manhua.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://appdoctruyen.id.vn/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang="vi">
      <head>
         <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={roboto.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
