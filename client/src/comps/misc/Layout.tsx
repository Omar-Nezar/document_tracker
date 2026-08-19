import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"
import { Outlet } from "react-router"

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={true} style={
      {
        "--sidebar-width": "14rem",
        "--sidebar-width-mobile": "14rem",
      } as React.CSSProperties
    }>
      <AppSidebar />

      <SidebarInset>
        <Header />

        <main className="flex-1 space-y-4 bg-muted/20 p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}