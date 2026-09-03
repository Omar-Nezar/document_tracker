import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { getUserTransactions, deleteTransaction } from "@/src/slices/transaction.slice";
import { useEffect, useState } from "react";
import showToast from "@misc/showToast";

import TransactionTable from "@/src/utils/tables/transaction/transactionTable";
import { createTransactionColumns } from "@/src/utils/tables/transaction/transactionColumns";
import { createEmployeeActions } from "@/src/utils/tables/transaction/transactionActions";
import { transactionColumns } from "@/src/utils/tables/transaction/transactionColumns";
import EditRequestDialog from "@/src/comps/misc/EditRequest";
import type { UTransaction } from "@shared/types/types";

export default function ManageTransactions() {
    const dispatch = useAppDispatch();
    const { transactions, loading } = useAppSelector(
        (state: any) => state.transaction
    );
    const [editingTransaction, setEditingTransaction] = useState<UTransaction | null>(null);

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

    const handleEditTransaction = (transaction: UTransaction) => {
        setEditingTransaction(transaction);
    };

    const columns = createTransactionColumns(
        transactionColumns,
        createEmployeeActions(handleDeleteTransaction, handleEditTransaction)
    )
    return (
        <>
            <TransactionTable
                data={transactions}
                columns={columns}
                loading={loading}
            />
            <EditRequestDialog
                transaction={editingTransaction}
                open={editingTransaction !== null}
                onOpenChange={(open) => {
                    if (!open) setEditingTransaction(null);
                }}
            />
        </>
    )
}