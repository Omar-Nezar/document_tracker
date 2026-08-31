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
    SidebarRail,
    SidebarFooter,
} from "@/components/ui/sidebar"

import { useIsMobile } from "@/hooks/use-mobile";
import {
    DropdownMenu,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
    BookText,
    ChevronsUpDown,
    BadgeCheck,
    LogOut,
    Bell,
} from "lucide-react"

import { sidebarConfig } from "@/src/utils/configs/sidebar.config"
import { Link, useLocation } from "react-router"
import decodeToken from "@/src/utils/functions/decodeToken"
import type { NavItem } from "@/src/utils/configs/sidebar.config"
import UserAvatar from "./UserAvatar";
import getInitials from "@/src/utils/functions/getInitials";
import { useHandleLogout } from "@/src/utils/functions/logout";

export function AppSidebar() {
    const location = useLocation()
    const isMobile = useIsMobile();
    const handleLogout = useHandleLogout();
    const { name, email, role } = decodeToken()!
    console.log(role)
    const group = sidebarConfig[role]

    const handleLogoutClick = () => {
        void handleLogout();
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b px-4 py-3">
                <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
                    <BookText className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Document Tracker</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                {group && (
                    <SidebarGroup>
                        <SidebarGroupLabel>
                            {group.label}
                        </SidebarGroupLabel>

                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item: NavItem) => {
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
                )}
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger
                                render={
                                    <SidebarMenuButton
                                        size="lg"
                                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                    />
                                }
                            >
                                <UserAvatar alt={name} fallback={getInitials(name)} />
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{name}</span>
                                    <span className="truncate text-xs">{email}</span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side={isMobile ? "bottom" : "right"}
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel className="p-0 font-normal">
                                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                            <UserAvatar alt={name} fallback={getInitials(name)} />
                                            <div className="grid flex-1 text-left text-sm leading-tight">
                                                <span className="truncate font-medium">{name}</span>
                                                <span className="truncate text-xs">{email}</span>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {/* <DropdownMenuItem onSelect={() => setAccountModalOpen(true)} onClick={() => setAccountModalOpen(true)}>
                                        <BadgeCheck />
                                        Account
                                    </DropdownMenuItem> */}
                                    <DropdownMenuItem>
                                        <Bell />
                                        Notifications
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem onClick={() => setDark((current) => !current)}>
                                        {dark ? <Sun /> : <Moon />}
                                        {dark ? "Light mode" : "Dark mode"}
                                    </DropdownMenuItem> */}
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={handleLogoutClick}>
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}