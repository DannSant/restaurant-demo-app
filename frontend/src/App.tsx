import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { fetchProducts } from "./store/slices/productsSlice";
import AppRouter from "./router/AppRouter";

import Sidebar from "./components/Sidebar";
import { useAppSelector } from "./store/hooks";
import { supabase } from "./lib/supabaseClient";
import { setUser } from "./store/slices/sessionSlice";

function App() {
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    // Initial session load
    supabase.auth.getSession().then(({ data }) => {
      dispatch(setUser(data.session?.user ?? null));
    });
  
    // Reactive session updates (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });
  
    return () => {
      listener.subscription.unsubscribe(); // cleanup
    };
  }, []);
  
 
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
      {user && <Sidebar />}
        <main className="flex-1 p-10 overflow-y-auto">
        <AppRouter />
        </main>
      </div>
    </Router>
  );
}

export default App;
