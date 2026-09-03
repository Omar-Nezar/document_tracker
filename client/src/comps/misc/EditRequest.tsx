import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import showToast from "@misc/showToast";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";

import {
    FileText,
    Upload,
    X,
} from "lucide-react";

import LoadingButton from "@/src/comps/misc/LoadingButton";
import ErrorField from "@/src/comps/misc/ErrorField";

import {
    useAppDispatch,
    useAppSelector,
    type RootState,
} from "@/src/store/store";

import { updateTransaction } from "@/src/slices/transaction.slice";

import {
    createTransactionSchema,
    type CreateTransactionForm,
} from "@shared/schemas/transaction.schema";

import type { UTransaction } from "@shared/types/types";

interface SelectedFile {
    file: File;
    id: string;
}

interface EditRequestDialogProps {
    transaction: UTransaction | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    admin?: boolean;
}

export default function EditRequestDialog({
    transaction,
    open,
    onOpenChange,
    admin = false,
}: EditRequestDialogProps) {
    const [files, setFiles] = useState<SelectedFile[]>([]);

    const { loading } = useAppSelector(
        (state: RootState) => state.transaction
    );

    const dispatch = useAppDispatch();

    const form = useForm<CreateTransactionForm>({
        resolver: zodResolver(createTransactionSchema),
        defaultValues: {
            amount: 0,
            categoryId: 0,
            description: "",
        },
    });

    /*
     * Populate form whenever a different transaction
     * is opened for editing.
     */
    useEffect(() => {
        if (!transaction) return;

        form.reset({
            amount: Number(transaction.amount),
            categoryId: Number(transaction.categoryId),
            description: transaction.description ?? "",
        });

        setFiles([]);
    }, [transaction, form]);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!event.target.files) return;

        const selectedFiles = Array.from(event.target.files).map(
            (file) => ({
                file,
                id: crypto.randomUUID(),
            })
        );

        setFiles((previous) => [
            ...previous,
            ...selectedFiles,
        ]);

        event.target.value = "";
    };

    const removeFile = (id: string) => {
        setFiles((previous) =>
            previous.filter((file) => file.id !== id)
        );
    };

    const handleSave = async (
        data: CreateTransactionForm,
        submit: boolean
    ) => {
        if (!transaction) return;

        const promise = dispatch(
            updateTransaction({
                id: transaction.id,
                data: {
                    ...data,
                    submit,
                },
                files: files.map(({ file }) => file),
                admin,
            })
        ).unwrap();

        showToast({
            promise,
            message: submit
                ? "Request submitted successfully"
                : "Draft updated successfully",
            description: submit
                ? "Your petty cash request has been submitted"
                : "Your petty cash request draft has been updated",
        });

        await promise;

        onOpenChange(false);
    };

    const categoryLabels: Record<number, string> = {
        1: "Vehicle Expense",
        2: "Office Supplies",
        3: "Transportation",
        4: "Emergency Expense",
        5: "Miscellaneous",
    };

    if (!transaction) return null;

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">

                <DialogHeader>
                    <DialogTitle>
                        Edit Petty Cash Request
                    </DialogTitle>

                    <DialogDescription>
                        {admin
                            ? "Update the transaction details. Its workflow status will remain unchanged."
                            : "Update your draft request before saving or submitting it."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit(
                        (data) => handleSave(data, !admin)
                    )}
                >
                    <div className="space-y-6">

                        {/* Request Details */}
                        <div className="space-y-4">

                            <div>
                                <h3 className="text-sm font-medium">
                                    Request Details
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Update the information for your
                                    petty cash request.
                                </p>
                            </div>

                            <FieldSet>
                                <FieldGroup>

                                    {/* Amount */}
                                    <Field>
                                        <FieldLabel htmlFor="edit-amount">
                                            Amount
                                        </FieldLabel>

                                        <div className="relative">
                                            <Input
                                                id="edit-amount"
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="0.000"
                                                className="pr-14"
                                                {...form.register(
                                                    "amount",
                                                    {
                                                        valueAsNumber: true,
                                                    }
                                                )}
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                OMR
                                            </span>
                                        </div>

                                        <ErrorField
                                            message={
                                                form.formState.errors
                                                    .amount?.message
                                            }
                                        />
                                    </Field>

                                    {/* Category */}
                                    <Field>
                                        <FieldLabel>
                                            Category
                                        </FieldLabel>

                                        <Select
                                            value={
                                                form.watch("categoryId")
                                                    ? String(
                                                        form.watch(
                                                            "categoryId"
                                                        )
                                                    )
                                                    : ""
                                            }
                                            onValueChange={(value) =>
                                                form.setValue(
                                                    "categoryId",
                                                    Number(value),
                                                    {
                                                        shouldValidate: true,
                                                    }
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category">
                                                    {
                                                        categoryLabels[
                                                        form.watch(
                                                            "categoryId"
                                                        )
                                                        ]
                                                    }
                                                </SelectValue>
                                            </SelectTrigger>

                                            <SelectContent>
                                                <SelectItem value="1">
                                                    Vehicle Expense
                                                </SelectItem>

                                                <SelectItem value="2">
                                                    Office Supplies
                                                </SelectItem>

                                                <SelectItem value="3">
                                                    Transportation
                                                </SelectItem>

                                                <SelectItem value="4">
                                                    Emergency Expense
                                                </SelectItem>

                                                <SelectItem value="5">
                                                    Miscellaneous
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <ErrorField
                                            message={
                                                form.formState.errors
                                                    .categoryId?.message
                                            }
                                        />
                                    </Field>

                                    {/* Description */}
                                    <Field>
                                        <FieldLabel htmlFor="edit-description">
                                            Description
                                        </FieldLabel>

                                        <FieldDescription className="text-xs text-muted-foreground">
                                            Provide enough detail for the
                                            request to be reviewed.
                                        </FieldDescription>

                                        <Textarea
                                            id="edit-description"
                                            placeholder="Describe what the petty cash will be used for..."
                                            className="min-h-32 resize-none"
                                            {...form.register(
                                                "description"
                                            )}
                                        />

                                        <ErrorField
                                            message={
                                                form.formState.errors
                                                    .description?.message
                                            }
                                        />
                                    </Field>

                                </FieldGroup>
                            </FieldSet>
                        </div>

                        {/* Documents */}
                        <div className="space-y-4">

                            <div>
                                <h3 className="text-sm font-medium">
                                    Supporting Documents
                                </h3>

                                <p className="text-xs text-muted-foreground">
                                    Add receipts or other supporting
                                    documents.
                                </p>
                            </div>

                            <FieldSet>
                                <FieldGroup>

                                    {/* Upload */}
                                    <FieldLabel
                                        htmlFor="edit-documents"
                                        className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50"
                                    >
                                        <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                                            <Upload className="size-5" />
                                        </div>

                                        <p className="text-sm font-medium">
                                            Upload documents
                                        </p>

                                        <p className="mt-1 text-xs text-muted-foreground">
                                            PDF, JPG, PNG up to 10MB
                                        </p>

                                        <Input
                                            id="edit-documents"
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </FieldLabel>

                                    {/* Existing files */}
                                    {transaction.documents?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                Existing files
                                            </p>

                                            {transaction.documents.map(
                                                (file: string, index: number) => (
                                                    <div
                                                        key={`${file}-${index}`}
                                                        className="flex items-center gap-3 rounded-md border p-3"
                                                    >
                                                        <FileText className="size-4 shrink-0 text-muted-foreground" />

                                                        <div className="min-w-0 flex-1">
                                                            <p
                                                                className="truncate text-sm font-medium"
                                                                title={file}
                                                            >
                                                                {file}
                                                            </p>

                                                            <p className="text-xs text-muted-foreground">
                                                                Existing document
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {/* New files */}
                                    {files.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium">
                                                New files
                                            </p>

                                            {files.map(
                                                ({ file, id }) => (
                                                    <div
                                                        key={id}
                                                        className="flex items-center gap-3 rounded-md border p-3"
                                                    >
                                                        <FileText className="size-4 shrink-0 text-muted-foreground" />

                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium">
                                                                {file.name}
                                                            </p>

                                                            <p className="text-xs text-muted-foreground">
                                                                {(
                                                                    file.size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(2)}{" "}
                                                                MB
                                                            </p>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                removeFile(id)
                                                            }
                                                        >
                                                            <X />
                                                        </Button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                </FieldGroup>
                            </FieldSet>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex-col gap-2 sm:flex-row">

                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={loading}
                        >
                            Cancel
                        </Button>

                        <LoadingButton
                            type={admin ? "submit" : "button"}
                            variant={admin ? "default" : "outline"}
                            onClick={admin ? undefined : form.handleSubmit(
                                (data) => handleSave(data, false)
                            )}
                            loading={loading}
                            loadingChildren="Saving..."
                        >
                            {admin ? "Save Changes" : "Save Changes"}
                        </LoadingButton>

                        {!admin && (
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                loadingChildren="Submitting..."
                            >
                                Submit Request
                            </LoadingButton>
                        )}

                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}