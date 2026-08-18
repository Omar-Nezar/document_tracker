// config/sidebarConfig.ts
import { Home, Users, Briefcase, Settings, type LucideIcon } from "lucide-react"

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export type SidebarConfig = Record<string, NavGroup>

export const sidebarConfig: SidebarConfig = {
  Employee: {
    label: "Employee Management",
    items: [
      { label: "Dashboard", to: "/employeeHome", icon: Home },
    ],
  },
//   Organization: {
//     label: "Organization",
//     items: [
//       { label: "Projects", to: "/projects", icon: Briefcase },
//       { label: "Settings", to: "/settings", icon: Settings },
//     ],
//   },
}