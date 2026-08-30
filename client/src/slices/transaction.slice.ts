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

interface CreateTransactionPayload extends CreateTransactionForm {
    submit: boolean;
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
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create request"
            );
        }
    }
);

export const getUserTransactions = createAsyncThunk(
    "transactions/getUserTransactions",
    async () => {
        try {
            const res = await API.get("/transaction/getUserTransactions");
            return res.data;
        } catch (error: any) {
            return error.response?.data?.message || "Failed to retrieve transactions";
        }
    }
)

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
    },
});

export const {
    clearTransactionMessages,
} = transactionSlice.actions;

export default transactionSlice.reducer;