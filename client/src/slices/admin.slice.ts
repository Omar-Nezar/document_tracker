import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";
import type { User } from "@shared/types/types";

export const getUsers = createAsyncThunk(
    "admin/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await API.get("/admin/getUsers");
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Users fetch failed");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await API.delete(`/admin/deleteUser/${id}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "User delete failed");
        }
    }
);

export const disableUser = createAsyncThunk(
    "admin/disableUser",
    async (id: number, { rejectWithValue }) => {
        try {
            const res = await API.patch(`/admin/disableUser/${id}`);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "User disable failed");
        }
    }
);

interface AdminState {
    users: User[];
    loading: boolean;
    msg: string | null;
    error: string | null;
}

const initialState: AdminState = {
    users: [],
    loading: false,
    msg: null,
    error: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        resetAdmin: (state) => {
            state.users = [];
            state.loading = false;
            state.msg = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // GET USERS
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(getUsers.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            // DELETE USER
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter((user) => user.id !== action.meta.arg);
            })
            .addCase(deleteUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        builder
            .addCase(disableUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(disableUser.fulfilled, (state, action) => {
                state.loading = false;
                state.msg = action.payload.message;
                const user = state.users.find((item) => item.id === action.meta.arg);
                if (user) user.isactive = false;
            })
            .addCase(disableUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;