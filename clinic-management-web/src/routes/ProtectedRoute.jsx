import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ allowedRoles = [] }) {
  const { loading, isAuthenticated, user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";

  // Tunggu proses restore session selesai
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d0ff] border-t-transparent" />
      </div>
    );
  }

  // Belum login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Jika route memiliki pembatasan role, cek hak akses
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  // Sudah login
  return <Outlet />;
}
