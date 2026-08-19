import { useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    FieldSet,
    FieldGroup,
    FieldLabel,
    FieldDescription,
} from "@/components/ui/field";

import {
    FileText,
    Upload,
    X,
} from "lucide-react";


interface SelectedFile {
    file: File;
    id: string;
}


export default function NewRequest() {
    const [files, setFiles] = useState<SelectedFile[]>([]);

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


    const handleSubmit = (event: React.SubmitEvent) => {
        event.preventDefault();

        // API call will go here later
        console.log("Submit request");
    };


    const handleSaveDraft = () => {
        // API call will go here later
        console.log("Save draft");
    };


    return (
        <div className="mx-auto w-full max-w-6xl p-6">

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        New Petty Cash Request
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Submit a new request for petty cash.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="grid gap-6 lg:grid-cols-3">

                    {/* Request Details */}
                    <Card className="lg:col-span-2">

                        <CardHeader>
                            <CardTitle>
                                Request Details
                            </CardTitle>

                            <CardDescription>
                                Provide the information for your
                                petty cash request.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <FieldSet>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="amount">
                                            Amount
                                        </FieldLabel>

                                        <div className="relative">

                                            <Input
                                                id="amount"
                                                name="amount"
                                                type="number"
                                                min="0"
                                                step="1"
                                                placeholder="0.000"
                                                className="pr-14"
                                                required
                                            />

                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                                OMR
                                            </span>
                                        </div>
                                    </Field>

                                    <Field>
                                        <FieldLabel>
                                            Category
                                        </FieldLabel>

                                        <Select required>

                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>

                                            <SelectContent>

                                                <SelectItem value="vehicle-expense">
                                                    Vehicle Expense
                                                </SelectItem>

                                                <SelectItem value="office-supplies">
                                                    Office Supplies
                                                </SelectItem>

                                                <SelectItem value="transportation">
                                                    Transportation
                                                </SelectItem>

                                                <SelectItem value="emergency">
                                                    Emergency Expense
                                                </SelectItem>

                                                <SelectItem value="miscellaneous">
                                                    Miscellaneous
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </Field>

                                    {/* Description */}

                                    <Field>
                                        <FieldLabel htmlFor="description">
                                            Description
                                        </FieldLabel>

                                        <Textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe what the petty cash will be used for..."
                                            className="min-h-32 resize-none"
                                            required
                                        />

                                        <FieldDescription className="text-xs text-muted-foreground">
                                            Provide enough detail for the request
                                            to be reviewed.
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>

                        <CardHeader>

                            <CardTitle>
                                Supporting Documents
                            </CardTitle>

                            <CardDescription>
                                Attach receipts or other supporting
                                documents.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="space-y-4">
                            <FieldSet>
                                <FieldGroup>

                                    {/* Upload area */}
                                    <FieldLabel
                                        htmlFor="documents"
                                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition-colors hover:bg-muted/50 w-full"
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
                                            id="documents"
                                            type="file"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                    </FieldLabel>

                                    {/* Selected files */}
                                    {files.length > 0 && (
                                        <div className="space-y-2">

                                            <p className="text-sm font-medium">
                                                Selected files
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
                        </CardContent>
                    </Card>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-3">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveDraft}
                    >
                        Save Draft
                    </Button>

                    <Button type="submit">
                        Submit Request
                    </Button>
                </div>
            </form>
        </div>
    );
}