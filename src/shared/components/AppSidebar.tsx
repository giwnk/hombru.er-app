"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { MAIN_NAV_ITEMS } from "../constants/navigation.constant";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/80">
      {/* 1. Header Sidebar: App Logo & Brand Name */}
      <SidebarHeader className="p-4 border-b border-border/60">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex justify-center items-center gap-1">
                <div className="relative h-6 w-45 overflow-hidden shrink-0 bg-muted/20">
                  <Image
                    src="/Hombruer Icon.png"
                    alt="Hombru.er Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* 2. Content Sidebar: Navigation Groups */}
      <SidebarContent className="px-2 py-3 space-y-4">
        {MAIN_NAV_ITEMS.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx} className="p-0">
            <SidebarGroupLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-1">
              {group.groupLabel}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.url ||
                    (item.url !== "/" && pathname?.startsWith(item.url));
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="h-9 px-3 font-sans text-xs"
                      >
                        <Link href={item.url} className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* 3. Footer Sidebar: App Badge */}
      <SidebarFooter className="p-3 border-t border-border/60">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Home Brewer v1.0</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Catat & kalibrasikan seduhan kopi harianmu.
          </p>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
