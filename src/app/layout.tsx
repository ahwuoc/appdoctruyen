"use client";
import { Geist } from "next/font/google";
import "./globals.css";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { AlbumProvider } from './provider/ProviderContext';
const geistSans = Geist({ subsets: ["latin"], weight: "400" });
// ===============Components Shadcui=============
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// ==================================================
export default function RootLayout({ children }: { children: React.ReactNode; })
{
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={` geistSans.className}`}>
        <Provider store={store}>
          <AlbumProvider>
            <div className="[--header-height:calc(theme(spacing.14))]">
              <SidebarProvider className="flex flex-col">
                <div className="flex flex-1">
                  <AppSidebar />
                  <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1  bg-custombg3 flex-col gap-4 ">
                      {children}
                    </div>
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </div>
          </AlbumProvider>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
