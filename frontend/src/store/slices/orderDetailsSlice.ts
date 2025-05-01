import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { OrderDetail } from "../../models/OrderDetail";

const apiUrl = import.meta.env.VITE_API_URL;

interface OrderDetailsState {
  orderDetails: OrderDetail[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderDetailsState = {
  orderDetails: [],
  loading: false,
  error: null,
};

export const fetchOrderDetails = createAsyncThunk<OrderDetail[], string>(
  "orderDetails/fetchOrderDetails",
  async (orderId) => {
    const response = await axios.get<OrderDetail[]>(`${apiUrl}/order-details?order_id=${orderId}`);
    return response.data;
  }
);

export const createOrderDetail = createAsyncThunk<OrderDetail, Omit<OrderDetail, "id">>(
  "orderDetails/createOrderDetail",
  async (detail) => {
    const response = await axios.post<OrderDetail>(`${apiUrl}/order-details`, detail);
    return response.data;
  }
);

export const updateOrderDetail = createAsyncThunk<OrderDetail, { id: string; fields: Partial<OrderDetail> }>(
  "orderDetails/updateOrderDetail",
  async ({ id, fields }) => {
    const response = await axios.put<OrderDetail>(`${apiUrl}/order-details/${id}`, fields);
    return response.data;
  }
);

export const deleteOrderDetail = createAsyncThunk<string, string>(
  "orderDetails/deleteOrderDetail",
  async (id) => {
    await axios.delete(`${apiUrl}/order-details/${id}`);
    return id;
  }
);

const orderDetailsSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<OrderDetail[]>) => {
        state.loading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch order details";
      })
      .addCase(createOrderDetail.fulfilled, (state, action: PayloadAction<OrderDetail>) => {
        state.orderDetails.push(action.payload);
      })
      .addCase(updateOrderDetail.fulfilled, (state, action: PayloadAction<OrderDetail>) => {
        const index = state.orderDetails.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.orderDetails[index] = action.payload;
        }
      })
      .addCase(deleteOrderDetail.fulfilled, (state, action: PayloadAction<string>) => {
        state.orderDetails = state.orderDetails.filter((d) => d.id !== action.payload);
      });
  },
});

export default orderDetailsSlice.reducer;
