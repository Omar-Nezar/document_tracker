import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { sidebarConfig } from "@/src/utils/configs/sidebar.config"

import { Link, useLocation } from "react-router"

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b px-4 py-3">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs">
                        A
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden">Acme Inc</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {Object.entries(sidebarConfig).map(([key, group]) => (
                    <SidebarGroup key={key}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const location = useLocation()
                                    const isActive = location.pathname === item.to
                                    const Icon = item.icon
                                    return (
                                        <SidebarMenuItem key={item.to}>
                                            <SidebarMenuButton
                                                isActive={isActive}
                                                tooltip={item.label}
                                                render={
                                                    <Link to={item.to}>
                                                        <Icon className="h-4 w-4" />
                                                        <span>{item.label}</span>
                                                    </Link>
                                                }
                                            />
                                        </SidebarMenuItem>
                                    )
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
        </Sidebar>
    )
}