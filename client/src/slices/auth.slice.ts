import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "./api";

export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await API.post("/auth/login", data);
            return res.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

interface AuthState {
    token: any;
    loading: boolean;
    msg: string | null;
    error: string | null;
}

const initialState: AuthState = {
    token: localStorage.getItem("authToken"),
    loading: false,
    msg: null,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload.token;
            state.msg = action.payload.msg;
        },
        resetAuth: (state) => {
            state.token = null
            state.loading = false
            state.msg = null
            state.error = null
        }
    },
    extraReducers: (builder) => {
        // LOGIN
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token || "";
            })
            .addCase(login.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;