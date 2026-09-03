import { historyTableFeatures } from "./historyTableFeatures"
import type { UTransactionHistory } from "@shared/types/types"
import {
    useTable,
    type ColumnDef,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Search,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface HistoryTableProps {
    data: UTransactionHistory[]
    columns: ColumnDef<UTransactionHistory, unknown>[]
}

export default function HistoryTable({ data, columns }: HistoryTableProps) {
    const table = useTable(
        {
            debugTable: true,
            features: historyTableFeatures,
            columns,
            data,
            globalFilterFn: "includesString",
        },
        (state) => state,
    )

    return (
        <>
            <div className="relative w-full max-w-sm">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={table.state.globalFilter ?? ""}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    placeholder="Search history..."
                    className="pl-8"
                />
            </div>
            <div className="rounded-md border border-muted-foreground">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow className="border-muted-foreground" key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const sorted = header.column.getIsSorted()
                                    const Icon = sorted === "asc"
                                        ? ArrowUp
                                        : sorted === "desc"
                                            ? ArrowDown
                                            : ArrowUpDown

                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 text-muted-foreground"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <table.FlexRender header={header} />
                                                    <Icon className="ml-2" />
                                                </Button>
                                            ) : (
                                                <table.FlexRender header={header} />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No history found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow className="border-muted-foreground" key={row.id}>
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-between gap-4 px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        {table.getPrePaginatedRowModel().rows.length.toLocaleString()} of {data.length.toLocaleString()} rows
                    </div>
                    <div className="flex items-center gap-6 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.state.pagination.pageSize}`}
                                onValueChange={(value) => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger size="sm" className="w-17.5">
                                    <SelectValue placeholder={`${table.state.pagination.pageSize}`} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>{pageSize}</SelectItem>
                                    ))}
                                    <SelectItem value="Infinity">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-25 items-center justify-center text-sm font-medium">
                            Page {table.state.pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="size-8" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}><ChevronsLeft /></Button>
                            <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft /></Button>
                            <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight /></Button>
                            <Button variant="outline" size="icon" className="size-8" onClick={() => table.lastPage()} disabled={!table.getCanLastPage()}><ChevronsRight /></Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
