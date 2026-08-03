import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ClipboardList,
  FileText,
  Stethoscope,
  Shield,
  Activity,
  UserRound,
  NotebookTabs,
  LogOut,
  UserCircle2,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";

const roleMenus = {
  admin: [
    { to: "/admin/dashboard", icon: LayoutDashboard, title: "Dashboard" },
    { to: "/doctors", icon: Stethoscope, title: "Dokter" },
    { to: "/patients", icon: Users, title: "Pasien" },
    { to: "/schedules", icon: CalendarDays, title: "Jadwal" },
    { to: "/bookings", icon: ClipboardList, title: "Booking" },
    { to: "/medical-records", icon: FileText, title: "Rekam Medis" },
    { to: "/users", icon: UserRound, title: "User" },
    { to: "/reports", icon: NotebookTabs, title: "Laporan" },
    { to: "/profile", icon: Shield, title: "Profil" },
  ],
  doctor: [
    { to: "/doctor/dashboard", icon: LayoutDashboard, title: "Dashboard Dokter" },
    { to: "/schedules", icon: CalendarDays, title: "Jadwal Praktik" },
    { to: "/bookings", icon: ClipboardList, title: "Booking" },
    { to: "/patients", icon: Users, title: "Daftar Pasien" },
    { to: "/medical-records", icon: FileText, title: "Rekam Medis" },
    { to: "/profile", icon: Shield, title: "Profil" },
  ],
  patient: [
    { to: "/patient/dashboard", icon: LayoutDashboard, title: "Home" },
    { to: "/doctors", icon: Stethoscope, title: "Dokter" },
    { to: "/bookings", icon: ClipboardList, title: "Booking" },
    { to: "/medical-records", icon: Activity, title: "Riwayat" },
    { to: "/profile", icon: Shield, title: "Profil" },
  ],
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";
  const base = `/${role}`;
  const items = (roleMenus[role] || roleMenus.admin).map((item) => ({
    ...item,
    to: item.to === "/profile" ? item.to : `${base}${item.to}`,
  }));

  const displayName = user?.name || "Pengguna";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    await logout();
    navigate("/login");
  };

  return (
    <aside className="flex h-full w-72 flex-col overflow-hidden bg-slate-900 text-white shadow-2xl lg:h-screen lg:sticky lg:top-0 lg:shadow-none">
      <div className="flex h-20 items-center border-b border-slate-700 px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500 text-xl font-bold">
          C
        </div>

        <div className="ml-3 min-w-0">
          <h2 className="truncate text-lg font-bold">ClinicMS</h2>
          <p className="truncate text-xs text-slate-400">Management System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
        {items.map(({ to, icon: Icon, title }) => (
          <SidebarItem key={to} to={to} icon={Icon} title={title} />
        ))}
      </nav>

      {/* Profil & logout — khusus mobile (desktop ada di navbar) */}
      <div className="border-t border-slate-700 p-4 lg:hidden">
        <div className="flex items-center gap-3 rounded-xl bg-slate-800 px-3 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cyan-500 text-sm font-bold">
            {initials || <UserCircle2 size={20} />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs capitalize text-slate-400">{role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-300 transition hover:bg-red-500/20 hover:text-red-400"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
