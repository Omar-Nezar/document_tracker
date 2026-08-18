import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <span className="font-semibold text-sm">Dashboard</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {/* notifications or search to be added later */}
        <span>Welcome back</span>
      </div>
    </header>
  )
}