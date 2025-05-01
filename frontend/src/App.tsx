import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import { useAppDispatch } from "./store/hooks";
import { fetchProducts } from "./store/slices/productsSlice";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import ReportsPage from "./pages/ReportsPage";

function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <aside className="w-64 bg-black text-white flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-gray-800">
        RestaurantApp
      </div>
      <nav className="flex-1 p-4 space-y-4">
        <Link
          to="/"
          className={`block px-4 py-2 rounded ${
            location.pathname === "/" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          Overview
        </Link>
        <Link
          to="/products"
          className={`block px-4 py-2 rounded ${
            location.pathname === "/products" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          Products
        </Link>
        <Link
          to="/orders"
          className={`block px-4 py-2 rounded ${
            location.pathname === "/orders" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          Orders
        </Link>
        <Link
          to="/reports"
          className={`block px-4 py-2 rounded ${
            location.pathname === "/reports" ? "bg-blue-600" : "hover:bg-gray-800"
          }`}
        >
          Reports
        </Link>
      </nav>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-10 overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
