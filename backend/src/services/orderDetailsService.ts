import axios from "axios";
import { OrderDetail } from "../models/OrderDetail";

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY!;

const supabase = axios.create({
  baseURL: `${SUPABASE_URL}/rest/v1/`,
  headers: {
    apikey: SUPABASE_API_KEY,
    Authorization: `Bearer ${SUPABASE_API_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
});

// Get order details for an order
export const fetchOrderDetails = async (order_id: string): Promise<OrderDetail[]> => {
  const { data } = await supabase.get<OrderDetail[]>(
    `order_details?order_id=eq.${order_id}&select=*`
  );
  return data;
};

// Create a new order detail
export const createOrderDetail = async (detail: Omit<OrderDetail, "id">): Promise<OrderDetail> => {
  const { data } = await supabase.post<OrderDetail[]>("order_details", detail);
  return data[0];
};

// Update an order detail
export const updateOrderDetail = async (
  id: string,
  updatedFields: Partial<OrderDetail>
): Promise<OrderDetail> => {
  const { data } = await supabase.patch<OrderDetail[]>(`order_details?id=eq.${id}`, updatedFields);
  return data[0];
};

// Delete an order detail
export const deleteOrderDetail = async (id: string): Promise<void> => {
  await supabase.delete(`order_details?id=eq.${id}`);
};
