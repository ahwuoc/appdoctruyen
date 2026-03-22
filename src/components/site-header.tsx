"use client";
import { SidebarIcon, LogOut, User, LogIn, UserPlus, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { Avatar } from "antd";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchComponents from "../app/components/SearchComponent";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase/supabaseClient";
import { Session } from "@supabase/supabase-js";
import { logoutUserAction } from "../app/(action)/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  const [userSession, setUserSession] = useState<Session | null>(null);
  const { toggleSidebar } = useSidebar();
  const { toast } = useToast();
  const router = useRouter();

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
    const result = await logoutUserAction();
    if (result.success) {
      setUserSession(null);
      toast({
        title: "Đã đăng xuất",
        description: "Hẹn gặp lại bạn sớm!",
      });
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-[#0C1121]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0C1121]/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Button
            className="h-10 w-10 border-white/10 hover:bg-white/10 text-white flex shrink-0"
            variant="outline"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:inline-block font-black italic text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              mimi
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <SearchComponents />
          </div>

          <Separator orientation="vertical" className="h-6 bg-white/10" />

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors group">
                  <Avatar
                    className="border border-white/10 scale-90 group-hover:scale-100 transition-transform"
                    src={userSession?.user?.user_metadata?.avatar_url}
                  />
                  {userSession && (
                    <span className="hidden lg:inline-block text-sm font-medium text-gray-300 pr-2">
                      {userSession.user.email?.split('@')[0]}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#151d35]/95 backdrop-blur-2xl border-white/10 text-white p-2 mt-2" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Tài khoản</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userSession?.user?.email || "Chưa đăng nhập"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                {userSession ? (
                  <>
                    <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer gap-2">
                      <Link href="/profile">
                        <User className="h-4 w-4" />
                        Trang cá nhân
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={handleLogout} className="focus:bg-red-500/20 text-red-400 cursor-pointer gap-2">
                      <LogOut className="h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer gap-2">
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        Đăng nhập
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-white/10 cursor-pointer gap-2">
                      <Link href="/register">
                        <UserPlus className="h-4 w-4" />
                        Tạo tài khoản
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </header>
  );
}
