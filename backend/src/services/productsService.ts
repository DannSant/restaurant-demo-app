import axios from "axios";
import { Product } from "../models/Product";
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

// Fetch all products
export const fetchProducts = async () => {
  const { data } = await supabase.get("menu_items?select=*");
  return data;
};

// Add a product
export const addProduct = async (product: Product) => {
  const { data } = await supabase.post("menu_items", product);
  return data[0];
};

// Update a product
export const editProduct = async (id: string, product: Partial<Product>) => {
  const { data } = await supabase.patch(`menu_items?id=eq.${id}`, product);
  return data[0];
};

// Delete a product
export const removeProduct = async (id: string) => {
    await supabase.patch(`menu_items?id=eq.${id}`, {
      disabled: true,
    });
  };
