import { type User } from "@shared/types/types"
import {
    createColumnHelper,
    type ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { userBadgeMapping } from "@/src/utils/other/badgeMapping"
import { userTableFeatures } from "./userTableFeatures"

export const columnHelper = createColumnHelper<typeof userTableFeatures, User>()

export const userColumns = [
    columnHelper.accessor("id", {
        header: "User ID",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => {
            const role = info.getValue()
            const Icon = userBadgeMapping[role].icon
            return (
                <Badge
                    variant={userBadgeMapping[role].variant}
                    className={cn(
                        userBadgeMapping[role].className,
                        "text-xs w-23 flex items-center justify-start"
                    )}
                >
                    <Icon className="mr-1 h-4 w-4 shrink-0" />
                    <span className="truncate">{role}</span>
                </Badge>
            )
        },
    }),

    columnHelper.accessor("department", {
        header: "Department",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("branch", {
        header: "Branch",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("isactive", {
        header: "Status",
        cell: (info) => {
            const isActive = info.getValue()
            return isActive
                ? <Badge variant="default" className="bg-green-500 w-15">Active</Badge>
                : <Badge variant="destructive" className="w-15">Inactive</Badge>
        }
    }),

    columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => info.getValue(),
    }),
]

export function createUserColumns(
    actions?: ColumnDef<User, unknown>
) {
    return [
        ...userColumns,
        ...(actions ? [actions] : []),
    ]
}