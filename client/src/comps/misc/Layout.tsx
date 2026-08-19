import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Header } from "./Header"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset>
        <Header />

        <main className="flex-1 space-y-4 bg-muted/20 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}