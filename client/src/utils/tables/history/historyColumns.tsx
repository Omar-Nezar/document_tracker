import type { UTransactionHistory } from "@shared/types/types"
import {
    createColumnHelper,
    type ColumnDef,
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { transactionBadgeMapping } from "@/src/utils/other/badgeMapping"
import { historyTableFeatures } from "./historyTableFeatures"

export const columnHelper = createColumnHelper<typeof historyTableFeatures, UTransactionHistory>()

export const historyColumns: ColumnDef<UTransactionHistory, unknown>[] = [
    columnHelper.accessor("transactionNumber", {
        header: "Transaction Number",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("requesterName", {
        header: "Requester",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("toStatus", {
        header: "New Status",
        cell: (info) => {
            const status = info.getValue()
            return (
                <Badge
                    variant={transactionBadgeMapping[status].variant}
                    className={cn(transactionBadgeMapping[status].className, "text-xs")}
                >
                    {status}
                </Badge>
            )
        },
    }),
    columnHelper.accessor("fromStatus", {
        header: "Previous Status",
        cell: (info) => info.getValue() ?? "Initial",
    }),
    columnHelper.accessor("changedByName", {
        header: "Changed By",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("comment", {
        header: "Comment",
        cell: (info) => info.getValue() ?? "—",
    }),
    columnHelper.accessor("createdAt", {
        header: "Changed At",
        cell: (info) => info.getValue(),
    }),
]
