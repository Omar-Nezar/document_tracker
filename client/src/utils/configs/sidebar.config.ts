// config/sidebarConfig.ts
import {
  Home,
  FilePlusCorner,
  Table2,
  type LucideIcon
} from "lucide-react"

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
      { label: "Requests", to: "/addRequest", icon: FilePlusCorner },
      { label: "My Transactions", to: "/manageTransactions", icon: Table2 },
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