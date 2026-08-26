import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";
import type { Transaction } from "@shared/types/types";
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
    transactions: Transaction[];
    currentTransaction: Transaction | null;
    loading: boolean;
    error: string | null;
    success: string | null;
}


const initialState: TransactionState = {
    transactions: [],
    currentTransaction: null,
    loading: false,
    error: null,
    success: null,
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

const transactionSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {
        clearTransactionMessages: (state) => {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // CREATE
            .addCase(createTransaction.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = null;
            })
            .addCase(createTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTransaction = action.payload.transaction;
                state.transactions.unshift(action.payload.transaction);
                state.success = action.payload.message;
            })
            .addCase(createTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create request";
            }
            );
    },
});

export const {
    clearTransactionMessages,
} = transactionSlice.actions;

export default transactionSlice.reducer;