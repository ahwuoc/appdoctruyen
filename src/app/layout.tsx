import { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

import { siteConfig } from "@/config/site";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: "#0C1121",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - App Đọc Truyện Online Miễn Phí`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.name} - Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại. Tốc độ load nhanh, không quảng cáo.`,
  keywords: [siteConfig.name, "đọc truyện tranh", "manga online", "truyện tranh", "manhwa", "manhua", "truyện mới cập nhật", "truyện hay"],
  authors: [{ name: `${siteConfig.name} Team` }],
  creator: `${siteConfig.name} Team`,
  publisher: `${siteConfig.name} Team`,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: siteConfig.url,
    title: `${siteConfig.name} - App Đọc Truyện Online Miễn Phí`,
    description: `${siteConfig.name} - Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại.`,
    siteName: siteConfig.name,
    images: [siteConfig.logo],
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
    "name": siteConfig.name,
    "url": siteConfig.url,
  };

  return (
    <html lang="vi" className={`${outfit.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-mimi-blue/30 overflow-x-hidden bg-mimi-dark text-white">
        <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
        <div className="fixed top-[30%] right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none"></div>

        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
