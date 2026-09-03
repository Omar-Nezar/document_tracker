import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import type { Transaction, UTransaction } from "@shared/types/types";
import type { CreateTransactionForm } from "@shared/schemas/transaction.schema";
import API from "./api";

// interface Transaction {
//     id: number;
//     transactionNumber: string;

//     requesterId: number;
//     departmentId: number;
//     branchId: number;
//     categoryId: number;

//     amount: string;
//     description: string;

//     status: string;

//     createdAt: string;
//     updatedAt: string;
// }

export type UTransactionPartial = Partial<UTransaction>;

interface CreateTransactionPayload extends CreateTransactionForm {
    submit: boolean;
}

interface UpdateTransactionPayload {
    id: number;
    data: CreateTransactionPayload;
    files: File[];
    admin?: boolean;
}

interface TransactionState {
    transactions: UTransaction[];
    loading: boolean;
    error: string | null;
    msg: string | null;
}


const initialState: TransactionState = {
    transactions: [],
    loading: false,
    error: null,
    msg: null,
};

const categoryLabels: Record<number, string> = {
    1: "Vehicle Expense",
    2: "Office Supplies",
    3: "Transportation",
    4: "Emergency Expense",
    5: "Miscellaneous",
};

export const createTransaction = createAsyncThunk<
    {
        message: string;
        transaction: Transaction;
    },
    {
        data: CreateTransactionPayload;
        files: File[];
    },
    {
        rejectValue: string;
    }
>(
    "transactions/create",

    async (
        {
            data,
            files,
        },
        { rejectWithValue }
    ) => {
        try {
            const formData = new FormData();

            formData.append(
                "amount",
                String(data.amount)
            );

            formData.append(
                "categoryId",
                String(data.categoryId)
            );

            formData.append(
                "description",
                data.description
            );

            formData.append(
                "submit",
                String(data.submit)
            );

            files.forEach((file) => {
                formData.append(
                    "documents",
                    file
                );
            });

            const res = await API.post("/transaction/create", formData);
            return res.data;

        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to create request");
        }
    }
);

export const updateTransaction = createAsyncThunk<
    { message: string; transaction: Transaction },
    UpdateTransactionPayload,
    { rejectValue: string }
>(
    "transactions/updateTransaction",
    async ({ id, data, files, admin = false }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("amount", String(data.amount));
            formData.append("categoryId", String(data.categoryId));
            formData.append("description", data.description);
            formData.append("submit", String(data.submit));

            files.forEach((file) => formData.append("documents", file));

            const endpoint = admin
                ? `/transaction/updateTransactionAdmin/${id}`
                : `/transaction/updateTransaction/${id}`;
            const res = await API.put(endpoint, formData);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update request"
            );
        }
    }
);

export const getUserTransactions = createAsyncThunk(
    "transactions/getUserTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/transaction/getUserTransactions");
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to retrieve transactions");
        }
    }
)

export const getTransactions = createAsyncThunk(
    "transactions/getTransactions",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/transaction/getTransactions");
            console.log(res.data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to retrieve transactions");
        }
    }
)

export const deleteTransaction = createAsyncThunk(
    "transactions/deleteTransaction",
    async (transactionId: number, { rejectWithValue }) => {
        try {
            const res = await API.delete(`/transaction/deleteTransaction/${transactionId}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete transaction");
        }
    }
);

export const deleteTransactionAdmin = createAsyncThunk(
    "transactions/deleteTransactionAdmin",
    async (transactionId: number, { rejectWithValue }) => {
        try {
            const res = await API.delete(`/transaction/deleteTransactionAdmin/${transactionId}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete transaction");
        }
    }
);

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        clearTransactionMessages: (state) => {
            state.error = null;
            state.msg = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = action.payload.message;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create request";
            });
        builder
            // UPDATE
            .addCase(updateTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(updateTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = action.payload.message;
                const index = state.transactions.findIndex(
                    (transaction) => transaction.id === action.payload.transaction.id
                );
                if (index !== -1) {
                    state.transactions[index] = {
                        ...state.transactions[index],
                        ...action.payload.transaction,
                        categoryId: action.payload.transaction.categoryId,
                        category: categoryLabels[action.payload.transaction.categoryId],
                        documents: [
                            ...(state.transactions[index].documents ?? []),
                            ...action.meta.arg.files.map((file) => file.name),
                        ],
                    };
                }
            })
            .addCase(updateTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to update request";
            });
        builder
            // GET USER TRANSACTIONS
            .addCase(getUserTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(getUserTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.msg = action.payload.message;
            })
            .addCase(getUserTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to retrieve transactions";
            });
        builder
            // GET TRANSACTIONS
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload.transactions;
                state.msg = action.payload.message;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to retrieve transactions";
            });
        builder
            // DELETE TRANSACTION
            .addCase(deleteTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = action.payload.message;
                state.transactions = state.transactions.filter((transaction) => transaction.id !== action.meta.arg);
            })
            .addCase(deleteTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete transaction";
            });
        builder
            // DELETE TRANSACTION ADMIN
            .addCase( deleteTransactionAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.msg = null;
            })
            .addCase(deleteTransactionAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = action.payload.message;
                state.transactions = state.transactions.filter((transaction) => transaction.id !== action.meta.arg);
            })
            .addCase(deleteTransactionAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string || "Failed to delete transaction";
            });
    },
});

export const {
    clearTransactionMessages,
} = transactionSlice.actions;

export default transactionSlice.reducer;