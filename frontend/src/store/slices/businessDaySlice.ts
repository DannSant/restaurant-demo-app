import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { BusinessDay } from "../../models/BusinessDay";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


// Async Thunks
export const fetchCurrentBusinessDay = createAsyncThunk<BusinessDay | null>(
  "businessDay/fetchCurrentBusinessDay",
  async () => {
    const response = await axios.get<BusinessDay | null>(`${apiUrl}/business-day`);
    return response.data;
  }
);

export const startBusinessDay = createAsyncThunk<BusinessDay>(
  "businessDay/startBusinessDay",
  async () => {
    const response = await axios.post<BusinessDay>(`${apiUrl}/business-day/start`);
    return response.data;
  }
);

export const closeBusinessDay = createAsyncThunk<BusinessDay>(
  "businessDay/closeBusinessDay",
  async () => {
    const response = await axios.post<BusinessDay>(`${apiUrl}/business-day/close`);
    return response.data;
  }
);

// State
interface BusinessDayState {
  currentBusinessDay: BusinessDay | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessDayState = {
  currentBusinessDay: null,
  loading: false,
  error: null,
};

// Slice
export const businessDaySlice = createSlice({
  name: "businessDay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCurrentBusinessDay.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentBusinessDay.fulfilled, (state, action: PayloadAction<BusinessDay | null>) => {
        state.loading = false;
        state.currentBusinessDay = action.payload;
      })
      .addCase(fetchCurrentBusinessDay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch business day";
      })
      // Start
      .addCase(startBusinessDay.fulfilled, (state, action: PayloadAction<BusinessDay>) => {
        state.currentBusinessDay = action.payload;
      })
      .addCase(startBusinessDay.rejected, (state, action) => {
        state.error = action.error.message || "Failed to start business day";
      })
      // Close
      .addCase(closeBusinessDay.fulfilled, (state, action: PayloadAction<BusinessDay>) => {
        state.currentBusinessDay = action.payload;
      })
      .addCase(closeBusinessDay.rejected, (state, action) => {
        state.error = action.error.message || "Failed to close business day";
      });
  },
});

export default businessDaySlice.reducer;
