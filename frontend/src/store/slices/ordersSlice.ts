import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Order } from "../../models/Order";

const apiUrl = import.meta.env.VITE_API_URL;

type CreateOrderInput = Omit<Order, "id" | "created_at" | "status">;

interface OrdersState {
    orders: Order[];
    error: string | null;
    loading: boolean;
}

const initialState: OrdersState = {
    orders: [],
    error: null,
    loading: false,
}

export const createOrder = createAsyncThunk<Order, CreateOrderInput>(
    "orders/createOrder",
    async (orderData) => {
        console.log(orderData)
        const response = await axios.post<Order>(`${apiUrl}/orders`, orderData);
        return response.data;
    }
);

export const updateOrder = createAsyncThunk<Order, { id: string; updatedFields: Partial<Order> }>(
    "orders/updateOrder",
    async ({ id, updatedFields }) => {
        const response = await axios.put<Order>(`${apiUrl}/orders/${id}`, updatedFields);
        return response.data;
    }
);

export const closeOrder = createAsyncThunk<Order, { id: string; updatedFields: Partial<Order> }>(
    "orders/closeOrder",
    async ({ updatedFields }) => {
        const response = await axios.post<Order>(`${apiUrl}/orders/close`, updatedFields);
        return response.data;
    }
);

export const fetchOrders = createAsyncThunk<Order[], string>(
    "orders/fetchOrders",
    async (businessDayId) => {
        const response = await axios.get<Order[]>(
            `${apiUrl}/orders?business_day_id=${businessDayId}`
        );
        return response.data;
    }
);

export const fetchOrdersReport = createAsyncThunk<Order[], { status: string; from: string; to: string }>(
    "orders/fetchOrdersReport",
    async ({ status, from, to }) => {
        const response = await axios.get<Order[]>(
            `${apiUrl}/orders/report?status=${status}&from=${from}&to=${to}`
        );
        console.log(response)
        return response.data;
    }
);



export const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                state.orders.push(action.payload); // Optimistic update!
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.error = action.error.message || "Failed to create order";
            })
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch orders";
            })
            .addCase(updateOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                const index = state.orders.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(closeOrder.fulfilled, (state, action: PayloadAction<Order>) => {
                const index = state.orders.findIndex((o) => o.id === action.payload.id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(fetchOrdersReport.fulfilled, (state, action: PayloadAction<Order[]>) => {
                state.orders = action.payload;
            })
            .addCase(fetchOrdersReport.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch report";
            });

    },
});

export default ordersSlice.reducer;
