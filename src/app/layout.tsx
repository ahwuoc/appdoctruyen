import { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

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
    default: "mimi - App Đọc Truyện Online Miễn Phí",
    template: "%s | mimi",
  },
  description: "mimi - Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại. Tốc độ load nhanh, không quảng cáo.",
  keywords: ["mimi", "đọc truyện tranh", "manga online", "truyện tranh", "manhwa", "manhua", "truyện mới cập nhật", "truyện hay"],
  authors: [{ name: "mimi Team" }],
  creator: "mimi Team",
  publisher: "mimi Team",
  metadataBase: new URL('https://appdoctruyen.id.vn'),
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
    url: "https://appdoctruyen.id.vn",
    title: "mimi - App Đọc Truyện Online Miễn Phí",
    description: "mimi - Trang web đọc truyện tranh online miễn phí cập nhật mới nhất với hàng ngàn bộ truyện Manga, Manhwa, Manhua đủ các thể loại.",
    siteName: "mimi",
    images: ["/logo-white.png"],
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
    "name": "mimi",
    "url": "https://appdoctruyen.id.vn",
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
