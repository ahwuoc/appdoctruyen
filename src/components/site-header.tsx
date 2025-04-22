"use client";
import { SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchComponents from "../app/components/SearchComponent";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/supabaseClient";
import { Session } from "@supabase/supabase-js";
import apiAuth from "../app/api/apiRequest/apiAuth";

export function SiteHeader() {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUserSession(data.session);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await apiAuth.logout();
    localStorage.clear();
    setUserSession(null);
  };

  return (
    <header className="flex bg-bg_color sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex md:container md:mx-auto justify-between h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-12 w-12 border-none hover:none bg-transparent text-white"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}>
          <SidebarIcon />
        </Button>
        <div className="flex items-center">
          <SearchComponents />
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="relative inline-block text-left">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span className="p-4">
                  <Avatar />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2">
                {userSession ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Hồ sơ</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/register">Đăng ký</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Đăng nhập</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
