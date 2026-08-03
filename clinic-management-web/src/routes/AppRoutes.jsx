import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ProfilePage from "../pages/profile/ProfilePage";

import ProtectedRoute from "./ProtectedRoute";
import adminRoutes from "./AdminRoutes";
import doctorRoutes from "./DoctorRoutes";
import patientRoutes from "./PatientRoutes";

import useAuth from "../hooks/useAuth";

// Arahkan "/" ke dashboard milik role yang sedang login.
function HomeRedirect() {
  const { loading, isAuthenticated, user } = useAuth();
  const role = user?.role?.toLowerCase();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#00d0ff] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const homeByRole = {
    admin: "/admin/dashboard",
    doctor: "/doctor/dashboard",
    patient: "/patient/dashboard",
  };

  return <Navigate to={homeByRole[role] || "/login"} replace />;
}

// Render array konfigurasi rute menjadi elemen <Route>.
function renderRouteArray(routes) {
  return routes.map((route) => (
    <Route key={route.path} path={route.path} element={route.element} />
  ));
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root → redirect sesuai role */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Auth publik */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Profil: semua role yang login bisa akses */}
        <Route element={<ProtectedRoute roles={["admin", "doctor", "patient"]} />}>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Rute khusus ADMIN */}
        <Route element={<ProtectedRoute roles={["admin"]} />}>
          {renderRouteArray(adminRoutes)}
        </Route>

        {/* Rute khusus DOKTER */}
        <Route element={<ProtectedRoute roles={["doctor"]} />}>
          {renderRouteArray(doctorRoutes)}
        </Route>

        {/* Rute khusus PASIEN */}
        <Route element={<ProtectedRoute roles={["patient"]} />}>
          {renderRouteArray(patientRoutes)}
        </Route>

        {/* Tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
