"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import
{
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import
{
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { IconType } from "react-icons";

export function NavMain({
  items,
  title,
}: {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon | IconType;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
})
{
  const [openStates, setOpenStates] = useState<{ [key: string]: boolean; }>(() =>
  {
    const initialState: { [key: string]: boolean; } = {};
    items.forEach((item) =>
    {
      initialState[item.title] = !!item.isActive;
    });
    return initialState;
  });

  const toggleItem = (title: string) =>
  {
    setOpenStates((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup className="text-white">
      <SidebarGroupLabel className="text-white">{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild open={openStates[item.title]}>
            <SidebarMenuItem>
              {/* Menu cha */}
              <SidebarMenuButton
                asChild={!!item.url}
                tooltip={item.title}
              >
                {item.url ? (
                  <Link href={item.url} className="flex items-center w-full">
                    <item.icon />
                    <span className="ml-2">{item.title}</span>
                    {item.items?.length ? (
                      <ChevronRight
                        className={`ml-auto transition-transform ${openStates[item.title] ? "rotate-90" : ""
                          }`}
                        onClick={(e) =>
                        {
                          e.preventDefault(); // Ngăn Link điều hướng khi có sub-items
                          toggleItem(item.title);
                        }}
                      />
                    ) : null}
                  </Link>
                ) : (
                  <div
                    className="flex items-center cursor-pointer w-full"
                    onClick={() => toggleItem(item.title)}
                  >
                    <item.icon />
                    <span className="ml-2">{item.title}</span>
                    {item.items?.length ? (
                      <ChevronRight
                        className={`ml-auto transition-transform ${openStates[item.title] ? "rotate-90" : ""
                          }`}
                      />
                    ) : null}
                  </div>
                )}
              </SidebarMenuButton>

              {/* Sub-menu */}
              {item.items?.length ? (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className="text-white hover:bg-gray-700 w-full flex items-center px-4 py-2 rounded"
                          >
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}