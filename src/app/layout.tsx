"use client";
import { Geist } from "next/font/google";
import "./globals.css";
import { store } from "@/lib/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({ subsets: ["latin"], weight: "400" });

// ===============Components Shadcui=============
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

// ==================================================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={` geistSans.className}`}>
        <Provider store={store}>
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
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
