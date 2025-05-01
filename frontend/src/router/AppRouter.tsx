import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProductsPage from "../pages/ProductsPage";
import OrdersPage from "../pages/OrdersPage";
import ReportsPage from "../pages/ReportsPage";
import PrivateRoute from "./PrivateRoute";
import OverviewPage from "../pages/OverviewPage";
import OrderDetailsPage from "../pages/OrderDetailsPage";

export default function AppRouter() {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <OverviewPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
         <Route path="/orders/:id" element={<PrivateRoute><OrderDetailsPage /></PrivateRoute>} /> {/*I added this */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
