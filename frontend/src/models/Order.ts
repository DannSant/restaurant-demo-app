import { OrderDetail } from "./OrderDetail";

export interface Order {
    id: string;
    business_day_id: string;
    created_at: string;
    client_name?: string | null;
    notes?: string | null;
    status: "OPEN" | "PAID" | "CANCELLED";
    table_number?:number | null;
    orderDetails?: OrderDetail[];
  }
  