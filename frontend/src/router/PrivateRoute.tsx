import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      setSessionExists(!!data.session);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return sessionExists ? children : <Navigate to="/login" />;
}
