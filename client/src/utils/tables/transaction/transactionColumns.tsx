import { type UTransaction } from "@shared/types/types"
import {
    createColumnHelper,
    type ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { transactionBadgeMapping } from "@/src/utils/other/badgeMapping"
import { transactionTableFeatures } from "./transactionTableFeatures"

export const columnHelper = createColumnHelper<typeof transactionTableFeatures, UTransaction>()

export const transactionColumns = [
    columnHelper.accessor("transactionNumber", {
        header: "Transaction Number",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("description", {
        header: "Description",
        cell: (info) =>
            <div className="max-w-25 truncate" title={info.getValue()}>
                {info.getValue()}
            </div>,
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue()

            return (
                <Badge
                    variant={transactionBadgeMapping[status].variant}
                    className={cn(
                        transactionBadgeMapping[status].className,
                        "text-xs w-20"
                    )}
                >
                    {status}
                </Badge>
            )
        },
    }),

    columnHelper.accessor("documents", {
        header: "Files",
        cell: (info) => {
            const files = info.getValue() as string[] | undefined

            if (!files || files.length === 0) {
                return "—"
            }

            return (
                <div className="flex max-w-25 flex-col gap-1">
                    {files.map((file, index) => (
                        <div
                            key={`${file}-${index}`}
                            className="truncate"
                            title={file}
                        >
                            {file}
                        </div>
                    ))}
                </div>
            )
        },
    }),

    columnHelper.accessor("submittedAt", {
        header: "Submitted At",
        cell: (info) => {
            const value = info.getValue()

            return value
                ? value.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "—"
                : "—"
        },
    }),

    columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) =>
            info.getValue().match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "—",
    }),
]

export const adminTransactionColumns = [
    ...transactionColumns,
    columnHelper.accessor("requesterId", {
        header: "Requester ID",
        cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => info.getValue(),
    }),
]

export function createTransactionColumns(
    columns: ColumnDef<UTransaction, unknown>[],
    actions?: ColumnDef<UTransaction, unknown>
) {
    return [
        ...columns,
        ...(actions ? [actions] : []),
    ]
}