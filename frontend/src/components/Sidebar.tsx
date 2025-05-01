import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { supabase } from "../lib/supabaseClient";
import { setUser } from "../store/slices/sessionSlice";

export default function Sidebar() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();            // 🔐 Clear Supabase session
    dispatch(setUser(null));                  // 🧹 Clear Redux session
    navigate("/login");                       // 🚪 Redirect to login
  };

  return (
    <aside className="w-64 bg-black text-white flex flex-col">
      <div className="text-2xl font-bold p-6 border-b border-gray-800">
        RestaurantApp
      </div>
      <nav className="flex-1 p-4 space-y-4">
        {["/", "/products", "/orders", "/reports"].map((path) => (
          <Link
            key={path}
            to={path}
            className={`block px-4 py-2 rounded ${
              location.pathname === path ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            {path === "/" ? "Overview" : path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-400 hover:text-red-200"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
