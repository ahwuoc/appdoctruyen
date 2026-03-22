"use client";

import { SidebarIcon, Bell, Sparkles, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import SearchComponents from "../app/components/SearchComponent";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/5 bg-mimi-dark/60 backdrop-blur-3xl transition-all duration-500 overflow-hidden">
      {/* Top subtle highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

      <div className="flex h-16 items-center justify-between px-4 md:px-10 max-w-[1920px] mx-auto">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group/sidebar-btn relative h-11 w-11 flex items-center justify-center rounded-2xl bg-mimi-glass/10 border border-white/5 hover:border-mimi-blue/50 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)] overflow-hidden"
            onClick={toggleSidebar}
          >
            <div className="absolute inset-0 bg-mimi-blue/0 group-hover/sidebar-btn:bg-mimi-blue/5 transition-colors"></div>
            <SidebarIcon className="h-5 w-5 text-mimi-cyan group-hover/sidebar-btn:scale-110 transition-transform duration-300" />
          </motion.button>

          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-mimi-blue/20 blur-xl rounded-full opacity-40 animate-pulse"></div>
              <Image
                src="/images/logo.png"
                alt="mimi logo"
                width={40}
                height={40}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(37,99,235,0.4)] group-hover:scale-110 transition-transform duration-500"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black italic text-2xl tracking-tighter leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-mimi-muted">
                mimi
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-mimi-cyan opacity-80">READ ONLINE</span>
                <div className="w-1 h-1 rounded-full bg-mimi-cyan animate-pulse"></div>
              </div>
            </div>
          </Link>
        </div>

        {/* Center/Right: Actions & Search */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2">
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-mimi-blue hover:text-white transition-all hidden md:flex group/btn">
              <Bell className="w-4 h-4 text-mimi-blue group-hover/btn:scale-110 transition-transform" />
            </Button>
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-mimi-cyan hover:text-black transition-all hidden md:flex group/btn">
              <Settings className="w-4 h-4 text-mimi-cyan group-hover/btn:scale-110 transition-transform" />
            </Button>
          </div>

          <div className="relative group/search">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-mimi-blue/0 via-mimi-blue/20 to-mimi-blue/0 blur opacity-0 group-hover/search:opacity-100 transition-opacity duration-500 rounded-full"></div>
            <div className="relative bg-[#0C1121]/30 backdrop-blur-xl rounded-full border border-white/5 group-hover/search:border-white/10 transition-all p-0.5">
              <SearchComponents />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic bottom border pulse */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-mimi-blue to-transparent opacity-30 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
    </header>
  );
}
