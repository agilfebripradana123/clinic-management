import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth";

const HOME_BY_ROLE = {
  admin: "/admin/dashboard",
  doctor: "/doctor/dashboard",
  patient: "/patient/dashboard",
};

export default function ProtectedRoute({ roles = [] }) {
  const { loading, isAuthenticated, user } = useAuth();
  const role = user?.role?.toLowerCase() || "";

  // Tunggu proses restore session selesai
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d0ff] border-t-transparent" />
      </div>
    );
  }

  // Belum login → arahkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Role tidak berhak membuka route ini → arahkan ke dashboard miliknya
  if (roles.length > 0 && !roles.includes(role)) {
    return <Navigate to={HOME_BY_ROLE[role] || "/login"} replace />;
  }

  return <Outlet />;
}
