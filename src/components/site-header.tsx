"use client"

import { SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CiSearch } from "react-icons/ci";
import Avatar from "antd/es/avatar/Avatar"
import { Input } from "antd"
export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="flex  bg-bg_color sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex  md:container md:mx-auto justify-between h-[--header-height] w-full items-center gap-2 px-4">
        <Button
          className="h-12 w-12 border-none hover:none bg-transparent text-white "
          variant="ghost"
          size="icon"
          onClick={toggleSidebar} >
          <SidebarIcon />
        </Button>
        <div className="flex items-center" >
          <Dialog>
            <DialogTrigger asChild>
              <Button className="text-white border-none bg-transparent" variant="outline"> <CiSearch /></Button>
            </DialogTrigger>
            <DialogContent className="top-40 border-none bg-transparent border:none ">
              <DialogTitle className="hidden"></DialogTitle>
              <Input.Search className="bg-customBg" />
              <Button className="border-none">Nhập từ khóa bạn muốn tìm kiếm</Button>
            </DialogContent>
          </Dialog>
          <Separator orientation="vertical" className="mr-2 h-4" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-transparent border-none" variant="outline"><Avatar></Avatar></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Đăng ký</DropdownMenuLabel>
              <DropdownMenuItem>Đăng nhập</DropdownMenuItem>
       
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
