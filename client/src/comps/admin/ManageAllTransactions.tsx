import { useAppDispatch, useAppSelector } from "@/src/store/store";
import { getTransactions, deleteTransactionAdmin } from "@/src/slices/transaction.slice";
import { useEffect } from "react";
import showToast from "@misc/showToast";

import TransactionTable from "@/src/utils/tables/transaction/transactionTable";
import { createTransactionColumns } from "@/src/utils/tables/transaction/transactionColumns";
import { createAdminActions } from "@/src/utils/tables/transaction/transactionActions";

export default function ManageAllTransactions() {
    const dispatch = useAppDispatch();
    const { transactions, loading } = useAppSelector(
        (state: any) => state.transaction
    );

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const handleDeleteTransaction = async (transactionId: number) => {
        const promise = dispatch(deleteTransactionAdmin(transactionId)).unwrap();
        showToast({
            promise,
            message: "Transaction deleted successfully",
            description: "Draft successfully deleted",
        });
        await promise;
    }

    const columns = createTransactionColumns(
        createAdminActions(handleDeleteTransaction)
    )
    return (
        <TransactionTable
            data={transactions}
            columns={columns}
            loading={loading}
        />
    )
}