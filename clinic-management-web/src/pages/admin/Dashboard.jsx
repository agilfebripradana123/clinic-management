import { useEffect, useState } from "react";
import {
  Activity,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  ShieldCheck,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import BarChart from "../../components/charts/BarChart";
import DonutChart from "../../components/charts/DonutChart";
import useAuth from "../../hooks/useAuth";
import reportService from "../../services/reportService";

const statusColors = {
  pending: "#eda100",
  confirmed: "#2a78d6",
  completed: "#0ca30c",
  cancelled: "#e34948",
};

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
    { label: "Total Dokter", value: summary?.total_doctors, icon: Stethoscope, accent: "from-cyan-500 to-sky-500" },
    { label: "Total Pasien", value: summary?.total_patients, icon: Users, accent: "from-emerald-500 to-teal-500" },
    { label: "Total Booking", value: summary?.total_bookings, icon: ClipboardList, accent: "from-violet-500 to-fuchsia-500" },
    { label: "Rekam Medis", value: summary?.total_medical_records, icon: FileText, accent: "from-orange-500 to-amber-500" },
    { label: "Jadwal Praktik", value: summary?.total_schedules, icon: CalendarDays, accent: "from-blue-500 to-indigo-500" },
    { label: "Booking Hari Ini", value: summary?.today_bookings, icon: CalendarCheck, accent: "from-pink-500 to-rose-500" },
  ];

  const statusDonut = summary
    ? Object.entries(summary.status_breakdown || {}).map(([key, value]) => ({
        label:
          key === "pending"
            ? "Menunggu"
            : key === "confirmed"
              ? "Dikonfirmasi"
              : key === "completed"
                ? "Selesai"
                : "Dibatalkan",
        value,
        color: statusColors[key] || "#94a3b8",
      }))
    : [];

  const genderData = summary
    ? [
        { label: "Laki-laki", value: summary.gender_split?.L ?? 0, color: "#2a78d6" },
        { label: "Perempuan", value: summary.gender_split?.P ?? 0, color: "#eb6834" },
      ]
    : [];

  const maxTopDoctor = Math.max(
    ...(summary?.top_doctors || []).map((d) => d.total),
    1,
  );

  return (
    <DashboardLayout
      title="Dashboard Administrator"
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <Card className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-6 text-white md:p-8">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black md:text-3xl">
          <span>Selamat Datang,</span>
          <span className="ml-2">{user?.name ?? "Administrator"}</span>
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Pantau kinerja klinik — booking, pasien, dan rekam medis dalam satu
          tampilan.
        </p>
      </Card>

      {/* KPI stats */}
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
                  {loading ? "-" : value ?? 0}
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

      {/* Trend + Status */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Booking 7 hari terakhir */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Tren Booking 7 Hari
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Jumlah booking per hari
              </p>
            </div>

            <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-600">
              <TrendingUp size={22} />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <p className="text-sm text-slate-500">Memuat data...</p>
            ) : (
              <BarChart
                data={summary?.booking_trend || []}
                height={200}
              />
            )}
          </div>
        </Card>

        {/* Status booking */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Status Booking
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Distribusi seluruh booking
          </p>

          <div className="mt-6 flex justify-center">
            {loading ? (
              <p className="text-sm text-slate-500">Memuat data...</p>
            ) : (
              <DonutChart
                data={statusDonut}
                centerLabel="Booking"
              />
            )}
          </div>
        </Card>
      </div>

      {/* Top dokter + gender */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Top dokter */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Dokter Terpopuler
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Berdasarkan jumlah booking
          </p>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500">Memuat data...</p>
            ) : (summary?.top_doctors || []).length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada data.</p>
            ) : (
              summary.top_doctors.map((doctor, index) => (
                <div key={doctor.name} className="flex items-center gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {doctor.name}
                      </p>

                      <span className="text-sm font-bold text-slate-800">
                        {doctor.total}
                      </span>
                    </div>

                    <p className="truncate text-xs text-slate-500">
                      {doctor.specialist}
                    </p>

                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-cyan-500"
                        style={{
                          width: `${(doctor.total / maxTopDoctor) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Ringkasan status + gender */}
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Komposisi Pasien
            </h2>

            <div className="mt-5">
              {loading ? (
                <p className="text-sm text-slate-500">Memuat data...</p>
              ) : (
                <DonutChart
                  data={genderData}
                  size={140}
                  thickness={16}
                  centerLabel="Pasien"
                />
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Status Sistem
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-cyan-600" />
                  <span className="font-medium text-slate-800">API Service</span>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                  Running
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Activity className="text-violet-600" />
                  <span className="font-medium text-slate-800">Database</span>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                  Connected
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
