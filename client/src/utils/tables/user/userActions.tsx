import { columnHelper } from "./userColumns"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"

import {
    ChevronsUpDown,
    Ban,
    Pencil,
    Trash2,
} from "lucide-react"

export const createAdminActions = (
    handleDelete: (id: number) => void,
    handleDisable: (id: number) => void
) =>
    columnHelper.display({
        id: "actions",
        header: "Actions",

        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 p-0"
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
                                console.log(
                                    "Edit clicked for:",
                                    user
                                )
                            }
                            className="cursor-pointer"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => handleDisable(user.id)}
                            disabled={!user.isactive}
                            className="cursor-pointer"
                        >
                            <Ban className="mr-2 h-4 w-4" />
                            <span>{user.isactive ? "Disable" : "Disabled"}</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() =>
                                handleDelete(user.id)
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