import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
    user: user ? user : null, 
    error: false,
    success: false,
    loading: false,
    message: '',
};

// Register an user and sign in
export const register = createAsyncThunk("auth/register",

    async (user, thunkAPI) => {
        try {
            const data = await authService.register(user);

            // check for errors
            if (data.errors) {
                return thunkAPI.rejectWithValue(data.errors[0]);
            }
            return data;
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Logout an user
export const logout = createAsyncThunk("auth/logout", async () => {
    await authService.logout();
    return null; // Return null to indicate logout
}
);

// Sign in an user
export const login = createAsyncThunk("auth/login",

    async (user, thunkAPI) => {
        try {
            const data = await authService.login(user);

            // check for errors
            if (data.errors) {
                return thunkAPI.rejectWithValue(data.errors[0]);
            }
            return data;
        } catch (error) {
            const message = error.response ? error.response.data.message : error.message;
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const authSlice = createSlice({
    name: 'auth',   
    initialState,
    reducers: {
        reset: (state) => {
            state.error = false;
            state.success = false;
            state.loading = false;            
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
                state.message = 'Usuário registrado com sucesso!';
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
               state.message = action.payload || 'Falha ao registrar usuário!';
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = null;                
            }).addCase(login.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
                state.message = 'Usuário registrado com sucesso!';
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.user = null;
               state.message = action.payload || 'Falha ao registrar usuário!';
            })
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
