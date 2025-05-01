import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../models/Product";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Initial state type
interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

// Async Thunk
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const response = await axios.get<Product[]>(`${apiUrl}/products`);
    return response.data;
  }
);

export const addProduct = createAsyncThunk<Product, Omit<Product, "id" | "created_at">>(
  "products/addProduct",
  async (newProduct) => {
    const response = await axios.post<Product>(`${apiUrl}/products`, newProduct);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk<Product, { id: string; updatedProduct: Partial<Product> }>(
  "products/updateProduct",
  async ({ id, updatedProduct }) => {
    const response = await axios.put<Product>(`${apiUrl}/products/${id}`, updatedProduct);
    return response.data;
  }
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to add product";
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update product";
      });
  },
});

// Export actions
//export const { addProduct, updateProduct, deleteProduct } = productsSlice.actions;

// Export reducer
export default productsSlice.reducer;
