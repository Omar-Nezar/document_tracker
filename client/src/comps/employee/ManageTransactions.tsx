import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { getUserTransactions, deleteTransaction } from "@/src/slices/transaction.slice";
import { useEffect } from "react";
import showToast from "@misc/showToast";

import TransactionTable from "@/src/utils/tables/transaction/transactionTable";
import { createTransactionColumns } from "@/src/utils/tables/transaction/transactionColumns";
import { createEmployeeActions } from "@/src/utils/tables/transaction/transactionActions";

export default function ManageTransactions() {
    const dispatch = useAppDispatch();
    const { transactions, loading } = useAppSelector(
        (state: any) => state.transaction
    );

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

    const columns = createTransactionColumns(
        createEmployeeActions(handleDeleteTransaction)
    )
    return (
        <TransactionTable
            data={transactions}
            columns={columns}
            loading={loading}
        />
    )
}