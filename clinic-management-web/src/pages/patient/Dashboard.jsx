import { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList, Clock3, History } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import useAuth from "../../hooks/useAuth";
import useRoleBase from "../../hooks/useRoleBase";
import { getBookings } from "../../services/bookingService";
import { formatDate } from "../../utils/format";

const statusMeta = {
  pending: { label: "Menunggu", color: "warning" },
  confirmed: { label: "Dikonfirmasi", color: "info" },
  completed: { label: "Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const roleBase = useRoleBase();
  const patientId = user?.patient_id;

  const [stats, setStats] = useState({
    activeBookings: 0,
    historyBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    Promise.all([
      getBookings({ patient_id: patientId, per_page: 100 }),
      getBookings({ patient_id: patientId, per_page: 5 }),
    ])
      .then(([all, recent]) => {
        const active = all.data.filter(
          (b) => b.status === "pending" || b.status === "confirmed",
        ).length;
        const history = all.data.filter((b) => b.status === "completed")
          .length;

        setStats({ activeBookings: active, historyBookings: history });
        setRecentBookings(recent.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [patientId]);

  const statCards = [
    {
      label: "Booking Aktif",
      value: stats.activeBookings,
      icon: ClipboardList,
      accent: "from-cyan-500 to-sky-500",
    },
    {
      label: "Riwayat Booking",
      value: stats.historyBookings,
      icon: History,
      accent: "from-emerald-500 to-teal-500",
    },
    {
      label: "Jadwal Berikutnya",
      value: recentBookings.find(
        (b) => b.status === "pending" || b.status === "confirmed",
      )
        ? "Tersedia"
        : "Tidak ada",
      icon: CalendarCheck,
      accent: "from-violet-500 to-fuchsia-500",
    },
  ];

  return (
    <DashboardLayout
      title="Dashboard Pasien"
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <Card className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-6 text-white md:p-8">
        <h1 className="flex flex-wrap items-center gap-2 text-2xl font-black md:text-3xl">
          <span>Selamat Datang,</span>
          <span className="ml-2">{user?.name ?? "Pasien"}</span>
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Lihat dokter yang tersedia, status booking Anda, dan riwayat
          pemeriksaan.
        </p>
      </Card>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, accent }) => (
          <Card
            key={label}
            className="group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{label}</p>

                <h2 className="mt-3 text-3xl font-black text-slate-900">
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

      {/* Booking terbaru */}
      <Card className="mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Booking Terbaru
            </h2>

            <p className="text-sm text-slate-500">
              Status booking pemeriksaan Anda
            </p>
          </div>

          <Link
            to={`${roleBase}/bookings`}
            className="text-sm font-semibold text-cyan-600 hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Memuat booking...</p>
        ) : recentBookings.length === 0 ? (
          <p className="text-sm text-slate-500">
            Belum ada booking.{" "}
            <Link
              to={`${roleBase}/bookings/new`}
              className="font-semibold text-cyan-600 hover:underline"
            >
              Buat booking sekarang
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {recentBookings.map((booking) => {
              const status = statusMeta[booking.status] || {
                label: booking.status,
                color: "gray",
              };

              return (
                <div
                  key={booking.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-cyan-200 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-cyan-100 p-3 text-cyan-600">
                      <Clock3 size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        {booking.booking_code || "-"}
                      </p>

                      <p className="text-sm text-slate-500">
                        {booking.doctor_name || "-"} •{" "}
                        {formatDate(booking.booking_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge color={status.color}>{status.label}</Badge>

                    <Link
                      to={`${roleBase}/bookings/${booking.id}`}
                      className="text-sm font-semibold text-cyan-600 hover:underline"
                    >
                      Detail
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}
