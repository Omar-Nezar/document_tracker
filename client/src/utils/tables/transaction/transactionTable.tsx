import { useState } from "react"
import { transactionTableFeatures } from "./transactionTableFeatures"

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
import FilesDialog from "@misc/FilesDialog"
import type { UTransaction } from "@shared/types/types"

interface TransactionTableProps {
    data: UTransaction[]
    columns: ColumnDef<UTransaction, any>[]
    loading?: boolean
    onRowClick?: (transaction: UTransaction) => void
}

export default function TransactionTable({
    data,
    columns,
    loading,
    onRowClick,
}: TransactionTableProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<UTransaction | null>(null);
    const table = useTable(
        {
            debugTable: true,
            features: transactionTableFeatures,
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
                    value={table.state.globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    placeholder="Search all columns..."
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
                                    const Icon =
                                        sorted === 'asc'
                                            ? ArrowUp
                                            : sorted === 'desc'
                                                ? ArrowDown
                                                : ArrowUpDown

                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="-ml-3 h-8 data-[state=open]:bg-accent text-muted-foreground"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    <table.FlexRender header={header} />
                                                    <Icon className="ml-2" />
                                                </Button>
                                            ) : (
                                                <span className="text-red-400">
                                                    <table.FlexRender header={header} />
                                                </span>
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
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="border-muted-foreground cursor-pointer hover:bg-muted/50"
                                    key={row.id}
                                    onClick={() => setSelectedTransaction(row.original)}
                                >
                                    {row.getAllCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            onClick={(e) => {
                                                if (cell.column.id === "actions") {
                                                    e.stopPropagation();
                                                }
                                            }}
                                        >
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {/* Pagination controls */}
                <div className="flex items-center justify-between gap-4 px-2 py-4">
                    <div className="text-sm text-muted-foreground">
                        {table.getPrePaginatedRowModel().rows.length.toLocaleString()} of{' '}
                        {data.length.toLocaleString()} rows
                    </div>
                    <div className="flex items-center gap-6 lg:gap-8">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${table.state.pagination.pageSize}`}
                                onValueChange={(value) => table.setPageSize(Number(value))}
                            >
                                <SelectTrigger size="sm" className="w-17.5">
                                    <SelectValue
                                        placeholder={`${table.state.pagination.pageSize}`}
                                    />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <SelectItem key={pageSize} value={`${pageSize}`}>
                                            {pageSize}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="Infinity">All</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex w-25 items-center justify-center text-sm font-medium">
                            Page {table.state.pagination.pageIndex + 1} of{' '}
                            {Math.max(1, table.getPageCount())}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:flex"
                                onClick={() => table.firstPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to first page</span>
                                <ChevronsLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">Go to previous page</span>
                                <ChevronLeft />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="size-8"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="hidden size-8 lg:flex"
                                onClick={() => table.lastPage()}
                                disabled={!table.getCanLastPage()}
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight />
                            </Button>
                        </div>
                    </div>
                    <FilesDialog
                        selectedTransaction={selectedTransaction}
                        onClose={() => setSelectedTransaction(null)}
                    />
                </div>
            </div>
        </>
    )
}