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
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
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
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";
  const base = `/${role}`;
  const items = (roleMenus[role] || roleMenus.admin).map((item) => ({
    ...item,
    // Menu profil tetap global, sisanya diberi prefix role
    to: item.to === "/profile" ? item.to : `${base}${item.to}`,
  }));

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-slate-900 text-white shadow-2xl lg:shadow-none">
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
    </aside>
  );
};

export default Sidebar;
