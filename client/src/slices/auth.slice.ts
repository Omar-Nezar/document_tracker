import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
    // extraReducers: (builder) => {

    // },
});

export const { setToken, resetAuth } = authSlice.actions;
export default authSlice.reducer;