import { type UTransaction } from "@shared/types/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface FilesDialogProps {
    selectedTransaction: UTransaction | null;
    onClose: () => void;
}

export default function FilesDialog({ selectedTransaction, onClose }: FilesDialogProps) {

    return (
        <Dialog
            open={!!selectedTransaction}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Transaction Files
                    </DialogTitle>
                </DialogHeader>

                {selectedTransaction?.documents?.length ? (
                    <div className="flex flex-col gap-2">
                        {selectedTransaction.documents.map((file: string, index: number) => (
                            <div
                                key={`${file}-${index}`}
                                className="rounded-md border px-3 py-2 text-sm break-all"
                            >
                                {file}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No files attached to this transaction.
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}