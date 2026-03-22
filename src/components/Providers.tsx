"use client";

import { store } from "@/app/utils/common/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { AlbumProvider } from "@/app/utils/provider/ProviderContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AlbumProvider>
        <div className="[--header-height:calc(theme(spacing.14))]">
          <SidebarProvider className="flex flex-col">
            <div className="flex flex-1">
              <AppSidebar />
              <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 bg-custombg3 flex-col gap-4">
                  {children}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </AlbumProvider>
      <Toaster />
    </Provider>
  );
}
