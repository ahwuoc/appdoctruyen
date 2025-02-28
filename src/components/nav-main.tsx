"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { IconType } from "react-icons";
import { useState } from "react";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | IconType;
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup className="text-white">
      <SidebarGroupLabel className="text-white">Tác vụ</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const [isOpen, setIsOpen] = useState(!!item.isActive);
          return (
            <Collapsible key={item.title} asChild open={isOpen}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <div
                    className="flex items-center cursor-pointer w-full"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <item.icon />
                    <span className="ml-2">{item.title}</span>
                    {item.items?.length ? (
                      <ChevronRight className={`ml-auto transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    ) : null}
                  </div>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a className="text-white" href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}