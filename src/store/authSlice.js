import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabaseClient';


export const authenticateUser = createAsyncThunk(
    'auth/authenticateUser',
    async ({ email, password, isLoginMode }, { rejectWithValue }) => {
        try {
            let response;
            if (isLoginMode) {
                response = await supabase.auth.signInWithPassword({ email, password });
            } else {
                response = await supabase.auth.signUp({ email, password });
            }

            if (response.error) {
                return rejectWithValue(response.error.message);
            }

            if (response.data.session) {
                return {
                    accessToken: response.data.session.access_token,
                    user: response.data.user,
                };
            } else if (!isLoginMode) {
                return { message: "Registration successful! Check your email to verify account." };
            }
        } catch (err) {
            return rejectWithValue(err.message || "An error occurred");
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        isLoginMode: true,
        email: '',
        password: '',
        accessToken: null,
        errorMessage: '',
        successMessage: '',
        loading: false,
        isInactive: false,
        windowClosedStatus: false,
    },
    reducers: {
        toggleAuthMode: (state) => {
            state.isLoginMode = !state.isLoginMode;
            state.errorMessage = '';
            state.successMessage = '';
        },
        setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setErrorMessage: (state, action) => {
            state.errorMessage = action.payload;
        },
        copyTokenSuccess: (state) => {
            state.successMessage = 'Token copied to clipboard!';
        },
        disableUiAndCloseWindow: (state) => {
            state.isInactive = true;
            state.windowClosedStatus = true;

            window.close();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(authenticateUser.pending, (state) => {
                state.loading = true;
                state.errorMessage = '';
                state.successMessage = '';
            })
            .addCase(authenticateUser.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.accessToken) {
                    state.accessToken = action.payload.accessToken;
                } else if (action.payload?.message) {
                    state.successMessage = action.payload.message;
                }
            })
            .addCase(authenticateUser.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload;
            });
    },
});

export const {
    toggleAuthMode,
    setEmail,
    setPassword,
    setErrorMessage,
    copyTokenSuccess,
    disableUiAndCloseWindow,
} = authSlice.actions;

export default authSlice.reducer;