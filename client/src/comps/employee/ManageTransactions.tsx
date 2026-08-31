import { type UTransaction } from "@shared/types/types";
import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { getUserTransactions, deleteTransaction } from "@/src/slices/transaction.slice";
import { useEffect } from "react";
import { badgeMapping } from "@/src/utils/other/badgeMapping";
import { cn } from "@/lib/utils";
import { useState } from "react";
import FilesDialog from "@misc/FilesDialog";
import showToast from "@misc/showToast";

import {
    columnFilteringFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    globalFilteringFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
    useTable,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
    Search,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ChevronsUpDown,
    Pencil,
    Trash2,
} from 'lucide-react'

const features = tableFeatures({
    rowSortingFeature,
    rowPaginationFeature,
    columnFilteringFeature,
    globalFilteringFeature,
    sortedRowModel: createSortedRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
    },
    filterFns: {
        includesString: filterFn_includesString,
    },
})

const columnHelper = createColumnHelper<typeof features, UTransaction>()

export default function ManageTransactions() {
    const [selectedTransaction, setSelectedTransaction] = useState<UTransaction | null>(null);
    const dispatch = useAppDispatch();
    const { transactions, loading } = useAppSelector(
        (state: any) => state.transaction
    );
    const data = transactions;

    useEffect(() => {
        dispatch(getUserTransactions());
    }, [dispatch]);

    const handleDeleteTransaction = async (transactionId: number) => {
        const promise = dispatch(deleteTransaction(transactionId)).unwrap();
        showToast({
            promise,
            message: "Transaction deleted successfully",
            description: "Draft successfully deleted",
        });
        await promise;
    }

    const columns = columnHelper.columns([

        columnHelper.accessor('transactionNumber', {
            header: 'Transaction Number',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('category', {
            header: 'Category',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('amount', {
            header: 'Amount',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('description', {
            header: 'Description',
            cell: (info) => info.getValue(),
        }),

        columnHelper.accessor('status', {
            header: 'Status',
            cell: (info) =>
                <Badge variant={badgeMapping[info.getValue()].variant} className={cn(badgeMapping[info.getValue()].className, "text-xs w-20")}>
                    {info.getValue()}
                </Badge>,
        }),

        columnHelper.accessor('documents', {
            header: 'Files',
            cell: (info) => {
                const files = info.getValue() as string[] | undefined;

                if (!files || files.length === 0) return '—';

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
                );
            },
        }),

        columnHelper.accessor('submittedAt', {
            header: 'Submitted At',
            cell: (info) => !info.getValue()
                ? '—'
                : info.getValue(),
        }),

        columnHelper.accessor('createdAt', {
            header: 'Created At',
            cell: (info) => info.getValue(),
        }),

        columnHelper.display({
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const rowData = row.original;

                if (rowData.status !== 'DRAFT') {
                    return "—"
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                        }
                        />
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => console.log('Edit clicked for:', rowData)}
                                className="cursor-pointer"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => handleDeleteTransaction(rowData.id)}
                                className="cursor-pointer text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        })
    ])

    const table = useTable(
        {
            debugTable: true,
            features,
            columns,
            data,
            globalFilterFn: 'includesString',
        },
        (state) => state, // default selector
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