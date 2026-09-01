import { type UTransaction } from "@shared/types/types"
import {
    createColumnHelper,
    type ColumnDef
} from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { badgeMapping } from "@/src/utils/other/badgeMapping"
import { transactionTableFeatures } from "./transactionTableFeatures"

const columnHelper = createColumnHelper<typeof transactionTableFeatures, UTransaction>()

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
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue()

            return (
                <Badge
                    variant={badgeMapping[status].variant}
                    className={cn(
                        badgeMapping[status].className,
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
        cell: (info) =>
            !info.getValue()
                ? "—"
                : info.getValue(),
    }),

    columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: (info) => info.getValue(),
    }),
]

export function createTransactionColumns(
    actions?: ColumnDef<UTransaction, unknown>
) {
    return [
        ...transactionColumns,
        ...(actions ? [actions] : []),
    ]
}