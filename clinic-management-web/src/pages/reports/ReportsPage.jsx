import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  CalendarDays,
  FileText,
  Clock3,
  CalendarCheck,
  CheckCircle2,
  Timer,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";

import reportService from "../../services/reportService";

export default function ReportsPage() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = async () => {
    try {
      const response = await reportService.getSummary();

      setSummary(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Pasien",
      value: summary.total_patients,
      icon: Users,
      color: "bg-cyan-500",
    },
    {
      title: "Total Dokter",
      value: summary.total_doctors,
      icon: Stethoscope,
      color: "bg-emerald-500",
    },
    {
      title: "Total Booking",
      value: summary.total_bookings,
      icon: CalendarDays,
      color: "bg-violet-500",
    },
    {
      title: "Rekam Medis",
      value: summary.total_medical_records,
      icon: FileText,
      color: "bg-orange-500",
    },
    {
      title: "Jadwal Dokter",
      value: summary.total_schedules,
      icon: Clock3,
      color: "bg-blue-500",
    },
    {
      title: "Booking Hari Ini",
      value: summary.today_bookings,
      icon: CalendarCheck,
      color: "bg-indigo-500",
    },
    {
      title: "Booking Selesai",
      value: summary.completed_bookings,
      icon: CheckCircle2,
      color: "bg-green-500",
    },
    {
      title: "Booking Pending",
      value: summary.pending_bookings,
      icon: Timer,
      color: "bg-red-500",
    },
  ];

  return (
    <DashboardLayout
      title="Reports"
      subtitle="Ringkasan data klinik"
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.title}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className="mt-3 text-4xl font-bold text-slate-800">
                    {loading ? "-" : card.value ?? 0}
                  </h2>
                </div>

                <div
                  className={`rounded-2xl p-4 text-white ${card.color}`}
                >
                  <Icon size={28} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Ringkasan Klinik
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border bg-cyan-50 p-5">
            <p className="text-sm text-slate-500">
              Total Aktivitas
            </p>

            <h3 className="mt-2 text-3xl font-bold text-cyan-600">
              {loading ? "-" : summary.total_bookings ?? 0}
            </h3>
          </div>

          <div className="rounded-xl border bg-emerald-50 p-5">
            <p className="text-sm text-slate-500">
              Rekam Medis
            </p>

            <h3 className="mt-2 text-3xl font-bold text-emerald-600">
              {loading
                ? "-"
                : summary.total_medical_records ?? 0}
            </h3>
          </div>

          <div className="rounded-xl border bg-violet-50 p-5">
            <p className="text-sm text-slate-500">
              Booking Hari Ini
            </p>

            <h3 className="mt-2 text-3xl font-bold text-violet-600">
              {loading
                ? "-"
                : summary.today_bookings ?? 0}
            </h3>
          </div>

          <div className="rounded-xl border bg-orange-50 p-5">
            <p className="text-sm text-slate-500">
              Jadwal Dokter
            </p>

            <h3 className="mt-2 text-3xl font-bold text-orange-600">
              {loading
                ? "-"
                : summary.total_schedules ?? 0}
            </h3>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}