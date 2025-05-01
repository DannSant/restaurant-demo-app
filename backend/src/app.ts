import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

import productsRoutes from "./routes/productsRoutes";
import businessDayRoutes from "./routes/businessDayRoutes";
import ordersRoutes from "./routes/ordersRoutes";
import orderDetailsRoutes from "./routes/orderDetailsRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/", (_req, res) => {
  res.send("Restaurant API is running 🚀");
});

// Mount product routes
app.use("/products", productsRoutes);
app.use("/business-day", businessDayRoutes);
app.use("/orders", ordersRoutes);
app.use("/order-details", orderDetailsRoutes);

// Later we'll mount product routes here
// app.use("/products", productsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
