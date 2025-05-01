import axios from "axios";
import { BusinessDay } from "../models/BusinessDay";

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

// Fetch current running business day
export const fetchCurrentBusinessDay = async (): Promise<BusinessDay | null> => {
  const { data } = await supabase.get<BusinessDay[]>(
    "business_day?status=eq.RUNNING&select=*"
  );
  return data.length > 0 ? data[0] : null;
};

// Start a new business day
export const startBusinessDay = async (): Promise<BusinessDay> => {
  const today = new Date();
  const body = {
    business_day_date: today.toISOString().split("T")[0],
    start_time: today.toISOString(),
    status: "RUNNING",
  };

  const { data } = await supabase.post<BusinessDay[]>("business_day", body);
  return data[0];
};

// Close current business day
export const closeBusinessDay = async (id: string): Promise<BusinessDay> => {
  const now = new Date().toISOString();

  const { data } = await supabase.patch<BusinessDay[]>(
    `business_day?id=eq.${id}`,
    { end_time: now, status: "CLOSED" }
  );
  return data[0];
};
