import { useEffect, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock3,
  Stethoscope,
  Users,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";
import { getSchedules } from "../../services/scheduleService";
import { getBookings } from "../../services/bookingService";

export default function Dashboard() {
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [stats, setStats] = useState({
    schedules: 0,
    bookings: 0,
    todayPatients: 0,
    todaySchedules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getSchedules({ doctor_id: doctorId, per_page: 1 }),
      getBookings({ doctor_id: doctorId, per_page: 1 }),
      getSchedules({ doctor_id: doctorId, is_active: true, per_page: 100 }),
      getBookings({ doctor_id: doctorId, per_page: 1 }),
    ])
      .then(([schedules, bookings, activeSchedules]) => {
        const today = new Date().toISOString().split("T")[0];
        const todayBookings = bookings.total;

        setStats({
          schedules: activeSchedules.total,
          bookings: bookings.total,
          todayPatients: todayBookings,
          todaySchedules: schedules.total,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [doctorId]);

  const statCards = [
    {
      label: "Total Jadwal Praktik",
      value: stats.schedules,
      icon: CalendarDays,
      accent: "from-cyan-500 to-sky-500",
    },
    {
      label: "Total Booking",
      value: stats.bookings,
      icon: ClipboardList,
      accent: "from-violet-500 to-fuchsia-500",
    },
    {
      label: "Pasien Hari Ini",
      value: stats.todayPatients,
      icon: Users,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Jadwal Hari Ini",
      value: stats.todaySchedules,
      icon: Clock3,
      accent: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Dokter"
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <Card className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-6 text-white md:p-8">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black md:text-3xl">
          <span>Selamat Datang,</span>
          <span className="ml-2">{user?.name ?? "Dokter"}</span>
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Pantau jadwal praktik, booking, dan pasien yang dijadwalkan hari ini.
        </p>
      </Card>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
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

      <Card className="mt-6 flex items-center gap-4 p-6">
        <div className="rounded-2xl bg-cyan-100 p-4 text-cyan-600">
          <Stethoscope size={28} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {user?.specialist || "Dokter Praktik"}
          </h2>

          <p className="text-sm text-slate-500">
            Spesialisasi Anda tercatat pada sistem klinik.
          </p>
        </div>
      </Card>
    </DashboardLayout>
  );
}
