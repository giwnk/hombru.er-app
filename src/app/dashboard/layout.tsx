import type { Metadata } from "next";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/shared/components/AppSidebar";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Dashboard | Hombru.er",
  description: "Journaling coffee web for home brewer",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-svh">
        {/* Top Bar Header with SidebarTrigger */}
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/95 backdrop-blur-xs px-4 sm:px-6">
          <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-xs font-semibold text-muted-foreground">
            Hombru.er Dashboard
          </span>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

