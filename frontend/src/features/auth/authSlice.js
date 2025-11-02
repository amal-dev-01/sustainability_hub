import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authAPI from './authAPI';
import storageService from '../../services/storageService';

export const loginUser = createAsyncThunk('/auth/login/', async (credentials, thunkAPI) => {
  try {
    const data = await authAPI.login(credentials);
    storageService.setToken(data.access);
    return data.user;
  } catch (error) {
    const backendError =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      error.response?.data?.non_field_errors?.[0] ||
      'Login failed';
    return thunkAPI.rejectWithValue(backendError);
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await authAPI.logout();
  } catch (e) {
  } finally {
    storageService.clearToken();
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
