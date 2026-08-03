import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";

import { getSchedules } from "../../../services/scheduleService";

import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

export default function SchedulesPage() {
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadSchedules = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getSchedules({
        doctor_id: doctorId,
        page: currentPage,
        per_page: pageSize,
        search: keyword,
      });

      setSchedules(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  }, [doctorId, currentPage, pageSize, keyword]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, pageSize]);

  return (
    <DashboardLayout
      title="Jadwal Praktik Saya"
      subtitle="Daftar jadwal praktik dokter"
    >
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Cari hari..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            icon={Search}
          />
        </div>
      </div>

      {/* Card grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data jadwal...
          </div>
        ) : schedules.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada jadwal praktik untuk Anda.
          </div>
        ) : (
          schedules.map((schedule) => (
            <Card
              key={schedule.id}
              className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {DAY_LABELS[schedule.day] || schedule.day}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {schedule.specialist}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    schedule.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {schedule.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Hari</span>

                  <span className="font-medium">
                    {DAY_LABELS[schedule.day] || schedule.day}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Jam Praktik</span>

                  <span>
                    {schedule.start_time} - {schedule.end_time}
                  </span>
                </div>
              </div>

              {/* Action: hanya detail & edit (ubah status/jam), tanpa tambah/hapus */}
              <div className="mt-5 flex gap-2">
                <Link
                  to={`${roleBase}/schedules/${schedule.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                  title="Detail"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`${roleBase}/schedules/${schedule.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white hover:opacity-90"
                  title="Ubah Jam / Status"
                >
                  <Pencil size={16} />
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={total}
        totalPages={Math.max(1, Math.ceil(total / pageSize))}
      />
    </DashboardLayout>
  );
}
