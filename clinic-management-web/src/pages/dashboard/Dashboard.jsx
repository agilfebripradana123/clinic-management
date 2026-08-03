import {
  Activity,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Server,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";

import { getBookingCount } from "../../services/bookingService";
import { getDoctorCount } from "../../services/doctorService";
import { getPatientCount } from "../../services/patientService";
import { getScheduleCount } from "../../services/scheduleService";

const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];

const chartData = [52, 80, 68, 92, 75, 110];

const activities = [
  {
    icon: ClipboardList,
    title: "Booking baru berhasil dibuat",
    time: "10 menit lalu",
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
  {
    icon: Stethoscope,
    title: "Dokter memperbarui jadwal praktik",
    time: "35 menit lalu",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    icon: FileText,
    title: "Rekam medis pasien ditambahkan",
    time: "1 jam lalu",
    color: "text-violet-600",
    bg: "bg-violet-100",
  },
];

const baseStats = {
  admin: [
    {
      key: "doctor",
      label: "Total Dokter",
      icon: Stethoscope,
      accent: "from-cyan-500 to-sky-500",
      note: "Dokter aktif",
    },
    {
      key: "patient",
      label: "Total Pasien",
      icon: Users,
      accent: "from-emerald-500 to-teal-500",
      note: "Pasien terdaftar",
    },
    {
      key: "schedule",
      label: "Total Jadwal",
      icon: CalendarDays,
      accent: "from-violet-500 to-fuchsia-500",
      note: "Jadwal praktik",
    },
    {
      key: "booking",
      label: "Booking Hari Ini",
      icon: ClipboardList,
      accent: "from-amber-500 to-orange-500",
      note: "Booking aktif",
    },
  ],

  doctor: [
    {
      key: "schedule",
      label: "Jadwal Praktik",
      icon: CalendarDays,
      accent: "from-cyan-500 to-sky-500",
      note: "Minggu ini",
    },
    {
      key: "patient",
      label: "Pasien Hari Ini",
      icon: Users,
      accent: "from-emerald-500 to-teal-500",
      note: "Jadwal pemeriksaan",
    },
    {
      key: "record",
      label: "Rekam Medis",
      icon: FileText,
      accent: "from-violet-500 to-fuchsia-500",
      note: "Sudah dibuat",
    },
  ],

  patient: [
    {
      key: "doctor",
      label: "Dokter Tersedia",
      icon: Stethoscope,
      accent: "from-cyan-500 to-sky-500",
      note: "Hari ini",
    },
    {
      key: "booking",
      label: "Booking Aktif",
      icon: ClipboardList,
      accent: "from-emerald-500 to-teal-500",
      note: "Menunggu pemeriksaan",
    },
    {
      key: "history",
      label: "Riwayat Pemeriksaan",
      icon: FileText,
      accent: "from-violet-500 to-fuchsia-500",
      note: "Semua kunjungan",
    },
  ],
};

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const routeRole = location.pathname.split("/").filter(Boolean).at(-1);
  const role = ["admin", "doctor", "patient"].includes(routeRole)
    ? routeRole
    : user?.role?.toLowerCase() || "admin";

  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, [role]);

  async function loadDashboard() {
    try {
      const doctorCount = await getDoctorCount();
      const patientCount = await getPatientCount();
      const scheduleCount = await getScheduleCount();
      const bookingCount = await getBookingCount();

      const nextStats = baseStats[role].map((item) => {
        switch (item.key) {
          case "doctor":
            return {
              ...item,
              value: doctorCount,
            };

          case "patient":
            return {
              ...item,
              value: patientCount,
            };

          case "schedule":
            return {
              ...item,
              value: scheduleCount,
            };

          case "booking":
            return {
              ...item,
              value: bookingCount,
            };

          case "record":
            return {
              ...item,
              value: 53,
            };

          case "history":
            return {
              ...item,
              value: 12,
            };

          default:
            return item;
        }
      });

      setStats(nextStats);
    } catch (err) {
      console.error(err);

      setStats(
        baseStats[role].map((item) => ({
          ...item,
          value: "--",
        })),
      );
    }
  }

  const titleMap = {
    admin: "Dashboard Administrator",
    doctor: "Dashboard Dokter",
    patient: "Dashboard Pasien",
  };

  const heroCopy = {
    admin:
      "Kelola data dokter, pasien, jadwal praktik, booking pemeriksaan, serta rekam medis melalui dashboard ini.",
    doctor:
      "Pantau jadwal praktik, pasien yang dijadwalkan, dan rekam medis yang perlu ditangani hari ini.",
    patient:
      "Lihat dokter yang tersedia, status booking Anda, dan riwayat pemeriksaan yang telah dilakukan.",
  };

  return (
    <DashboardLayout
      title={titleMap[role]}
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <div className="space-y-6">
        <Card className="overflow-hidden bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-8 text-white">
          <h1 className="text-3xl font-black">
            Selamat Datang,
            <span className="ml-2">{user?.name ?? "Administrator"} 👋</span>
          </h1>

          <p className="mt-3 max-w-2xl text-cyan-100">{heroCopy[role]}</p>
        </Card>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, accent, note }) => (
            <Card
              key={label}
              className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{label}</p>

                  <h2 className="mt-3 text-4xl font-black text-slate-900">
                    {value}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">{note}</p>
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
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          {/* Grafik */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Grafik Booking Bulanan
                </h2>

                <p className="text-sm text-slate-500">
                  Statistik booking 6 bulan terakhir
                </p>
              </div>

              <div className="rounded-xl bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-600">
                +12%
              </div>
            </div>

            <div className="flex h-72 items-end justify-between gap-4 rounded-3xl bg-slate-50 p-6">
              {chartData.map((value, index) => (
                <div
                  key={months[index]}
                  className="flex flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-xs font-semibold text-slate-500">
                    {value}
                  </span>

                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-300 transition-all duration-300 hover:brightness-110"
                    style={{
                      height: `${value * 1.4}px`,
                    }}
                  />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    {months[index]}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Ringkasan Sistem */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900">Status Sistem</h2>

            <p className="mt-1 text-sm text-slate-500">
              Monitoring aplikasi klinik
            </p>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Server className="text-cyan-600" />
                  <span className="font-medium">Server</span>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-600">
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <Activity className="text-emerald-600" />
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

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-amber-500" />
                  <span className="font-medium">Backup</span>
                </div>

                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-600">
                  Terjadwal
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Aktivitas Terbaru */}
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Aktivitas Terbaru
                </h2>

                <p className="text-sm text-slate-500">
                  Aktivitas terbaru pada sistem klinik
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {activities.map(({ icon: Icon, title, time, color, bg }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-200 hover:bg-slate-50"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}
                  >
                    <Icon className={color} size={22} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800">{title}</h3>

                    <p className="mt-1 text-sm text-slate-500">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Informasi Sistem */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Informasi Sistem
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-slate-500">Framework Backend</span>

                <span className="font-semibold text-slate-800">Laravel 12</span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-slate-500">Framework Frontend</span>

                <span className="font-semibold text-slate-800">React 19</span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-slate-500">Database</span>

                <span className="font-semibold text-slate-800">MySQL</span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-slate-500">Authentication</span>

                <span className="font-semibold text-slate-800">
                  Laravel Sanctum
                </span>
              </div>

              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-slate-500">API</span>

                <span className="font-semibold text-emerald-600">
                  Connected
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500">Versi Aplikasi</span>

                <span className="rounded-lg bg-cyan-100 px-3 py-1 text-sm font-bold text-cyan-700">
                  v1.0.0
                </span>
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 p-5 text-white">
              <h3 className="text-lg font-bold">Clinic Management System</h3>

              <p className="mt-2 text-sm text-cyan-100">
                Sistem informasi klinik berbasis Laravel, React, dan MySQL untuk
                membantu pengelolaan data pasien, dokter, jadwal praktik,
                booking, serta rekam medis secara terintegrasi.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
