import { columnHelper } from "./transactionColumns"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import {
    ChevronsUpDown,
    Pencil,
    Trash2,
} from "lucide-react"

export const createEmployeeActions = (
    handleDelete: (id: number) => void,
    handleEdit: (transaction: import("@shared/types/types").UTransaction) => void
) =>
    columnHelper.display({
        id: "actions",
        header: "Actions",

        cell: ({ row }) => {
            const transaction = row.original

            if (transaction.status !== "DRAFT") {
                return "—"
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 m-0"
                            >
                                <span className="sr-only">
                                    Open menu
                                </span>

                                <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                        }
                    />

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                handleEdit(transaction)
                            }
                            className="cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                handleDelete(transaction.id)
                            }
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    })

export const createAdminActions = (
    handleDelete: (id: number) => void,
    handleEdit: (transaction: import("@shared/types/types").UTransaction) => void
) =>
    columnHelper.display({
        id: "actions",
        header: "Actions",

        cell: ({ row }) => {
            const transaction = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 p-0 m-0"
                            >
                                <span className="sr-only">
                                    Open menu
                                </span>

                                <ChevronsUpDown className="h-4 w-4" />
                            </Button>
                        }
                    />

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() =>
                                handleEdit(transaction)
                            }
                            className="cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                handleDelete(transaction.id)
                            }
                            className="cursor-pointer text-destructive focus:text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    })    