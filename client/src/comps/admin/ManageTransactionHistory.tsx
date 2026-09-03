import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/src/store/store"
import { getTransactionHistory } from "@/src/slices/transaction.slice"
import HistoryTable from "@/src/utils/tables/history/historyTable"
import { historyColumns } from "@/src/utils/tables/history/historyColumns"

export default function ManageTransactionHistory() {
    const dispatch = useAppDispatch()
    const { history, loading } = useAppSelector((state) => state.transaction)

    useEffect(() => {
        void dispatch(getTransactionHistory())
    }, [dispatch])

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Transaction History</h1>
                <p className="text-sm text-muted-foreground">Review status changes across all transactions.</p>
            </div>
            {loading && history.length === 0 ? (
                <p className="text-sm text-muted-foreground">Loading history...</p>
            ) : (
                <HistoryTable data={history} columns={historyColumns} />
            )}
        </div>
    )
}
