import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../services/authService';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null, 
    Error: false,
    Success: false,
    Loading: false,
    message: '',
};

// Register an user and sign in
export const register = createAsyncThunk('auth/register',

    async (user, thunkAPI) => {
        try {
            const data = await authService.register(user);

            // check for errors
            if (data.errors) {
                return thunkAPI.rejectWithValue(data.errors);
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
                state.Loading = false;
                state.Error = action.payload;
                state.user = null;
               state.message = action.payload || 'Falha ao registrar usuário!';
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
