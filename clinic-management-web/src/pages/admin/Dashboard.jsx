import { useEffect, useState } from "react";
import {
  Activity,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";
import reportService from "../../services/reportService";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportService
      .getSummary()
      .then((response) => setSummary(response.data))
      .catch(() => setSummary(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Total Dokter",
      value: summary?.total_doctors ?? 0,
      icon: Stethoscope,
      accent: "from-cyan-500 to-sky-500",
    },
    {
      label: "Total Pasien",
      value: summary?.total_patients ?? 0,
      icon: Users,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Total Booking",
      value: summary?.total_bookings ?? 0,
      icon: ClipboardList,
      accent: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Total Rekam Medis",
      value: summary?.total_medical_records ?? 0,
      icon: FileText,
      accent: "from-orange-500 to-amber-500",
    },
    {
      label: "Total Jadwal Praktik",
      value: summary?.total_schedules ?? 0,
      icon: CalendarDays,
      accent: "from-blue-500 to-indigo-500",
    },
    {
      label: "Booking Hari Ini",
      value: summary?.today_bookings ?? 0,
      icon: CalendarCheck,
      accent: "from-pink-500 to-rose-500",
    },
  ];

  const statusList = [
    {
      label: "Booking Selesai",
      value: summary?.completed_bookings ?? 0,
      color: "text-emerald-600",
    },
    {
      label: "Booking Menunggu",
      value: summary?.pending_bookings ?? 0,
      color: "text-amber-600",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Administrator"
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <Card className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-8 text-white">
        <h1 className="text-3xl font-black">
          Selamat Datang,
          <span className="ml-2">
            {user?.name ?? "Administrator"} 👋
          </span>
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Kelola data dokter, pasien, jadwal praktik, booking, dan rekam medis
          melalui dashboard ini.
        </p>
      </Card>

      {/* Statistik */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, accent }) => (
          <Card
            key={label}
            className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>

                <h2 className="mt-3 text-4xl font-black text-slate-900">
                  {loading ? "-" : value}
                </h2>
              </div>

              <div
                className={`rounded-2xl bg-gradient-to-br ${accent} p-4 text-white transition group-hover:scale-110`}
              >
                <Icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Ringkasan status */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Ringkasan Booking
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Status booking pada sistem
          </p>

          <div className="mt-6 space-y-5">
            {statusList.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-4"
              >
                <div className="flex items-center gap-3">
                  <Activity className={color} />
                  <span className="font-medium text-slate-800">{label}</span>
                </div>

                <span className={`text-2xl font-black ${color}`}>
                  {loading ? "-" : value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Status Sistem
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitoring aplikasi klinik
          </p>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-cyan-600" />
                <span className="font-medium">API Service</span>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                Running
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-violet-600" />
                <span className="font-medium">Database</span>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                Connected
              </span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
