import axios from "axios";
import { Order } from "../models/Order";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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

// Create a new order
export const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const { data } = await supabase.post<Order[]>("orders", {
        ...orderData,
        status: "OPEN",
    });
    return data[0];
};

// Update an order (generic)
export const updateOrder = async (id: string, updatedFields: Partial<Order>): Promise<Order> => {
    const { data } = await supabase.patch<Order[]>(`orders?id=eq.${id}`, updatedFields);
    return data[0];
};

// Fetch all orders, optionally filtered by business_day_id
export const fetchOrders = async (business_day_id?: string): Promise<Order[]> => {
    const query = business_day_id ? `orders?business_day_id=eq.${business_day_id}&select=*` : "orders?select=*";
    const { data } = await supabase.get<Order[]>(query);
    return data;
};

export const getOrdersWithDetailsByFilter = async (
    status: string,
    from: string,
    to: string
  ): Promise<Order[]> => {
    try {
        const fromTimestamp = dayjs.tz(from, "America/New_York").startOf("day").utc().format();
    const toTimestamp = dayjs.tz(to, "America/New_York").endOf("day").utc().format();
  
    const { data } = await supabase.get<any[]>(
      `orders?status=eq.${status}&created_at=gte.${fromTimestamp}&created_at=lte.${toTimestamp}&select=*,order_details(*)`
    );
    console.log(status, fromTimestamp, toTimestamp)
    console.log(data)
    return data.map((order) => ({
      ...order,
      orderDetails: order.order_details,
    }));
    }catch (error){
        console.error("Error fetching orders with details:", error);
        throw error;
    }
  };

