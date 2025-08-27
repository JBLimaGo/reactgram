import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../services/userService";

const initialState = {
  user: null,
  error: false,
  loading: false,
  success: false,
  message: null,
};

// Get user details
export const profile = createAsyncThunk(
  "user/profile",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const response = await userService.profile(user, token);
    if (response.error) {
      return thunkAPI.rejectWithValue(response.error);
    }
    return response;
  }
);

// Update user details
export const updateProfile = createAsyncThunk(
  "user/update",
  async (user, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await userService.updateProfile(user, token);
    if (data.error) {
      return thunkAPI.rejectWithValue(data.error[0]);
    }
    return data;
  }
);

// Get user details by ID
export const getUserDetails = createAsyncThunk(
  "user/getUserDetails",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const response = await userService.getUserDetails(id, token);
    if (response.error) {
      return thunkAPI.rejectWithValue(response.error);
    }
    return response;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
    reset: (state) => {
      state.error = false;
      state.loading = false;
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
        state.message = "Usuário Atualizado com sucesso!";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = {};
        state.message = action.payload || "Falha ao Atualizar usuário!";
      })
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.user = action.payload;
      })
  },
});

export const { reset, resetMessage } = userSlice.actions;
export default userSlice.reducer;
