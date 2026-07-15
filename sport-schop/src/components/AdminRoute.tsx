import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  if (!user || !user.is_staff) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}