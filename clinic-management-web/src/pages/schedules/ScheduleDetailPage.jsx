import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DAY_LABELS } from "../../utils/day";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Stethoscope,
  UserRound,
  BadgeCheck,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { getSchedule } from "../../services/scheduleService";
import { toast } from "../../utils/toast";
import useRoleBase from "../../hooks/useRoleBase";

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();

  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedule();
  }, [id]);

  async function loadSchedule() {
    try {
      const data = await getSchedule(id);
      setSchedule(data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat detail jadwal.");
      navigate(`${roleBase}/schedules`);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Detail Jadwal" subtitle="Memuat data...">
        <Card className="p-6">Memuat...</Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Detail Jadwal"
      subtitle="Informasi lengkap jadwal praktik dokter"
    >
      <Card className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {schedule.doctor_name}
            </h2>

            <p className="mt-1 text-slate-500">{schedule.specialist}</p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              schedule.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {schedule.is_active ? "Aktif" : "Nonaktif"}
          </span>
        </div>

        {/* Detail */}
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoItem
            icon={<UserRound size={18} />}
            label="Nama Dokter"
            value={schedule.doctor_name}
          />

          <InfoItem
            icon={<Stethoscope size={18} />}
            label="Spesialis"
            value={schedule.specialist}
          />

          <InfoItem
            icon={<CalendarDays size={18} />}
            label="Hari Praktik"
            value={DAY_LABELS[schedule.day] || schedule.day}
          />

          <InfoItem
            icon={<Clock3 size={18} />}
            label="Jam Praktik"
            value={`${schedule.start_time} - ${schedule.end_time}`}
          />

          <InfoItem
            icon={<BadgeCheck size={18} />}
            label="Status"
            value={schedule.is_active ? "Aktif" : "Nonaktif"}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end border-t pt-6">
          <Button variant="secondary" onClick={() => navigate(`${roleBase}/schedules`)}>
            <ArrowLeft size={18} />
            Kembali
          </Button>
        </div>
      </Card>
    </DashboardLayout>
  );
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-2 flex items-center gap-2 text-cyan-600">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>

      <p className="text-base font-semibold text-slate-800">{value || "-"}</p>
    </div>
  );
}
