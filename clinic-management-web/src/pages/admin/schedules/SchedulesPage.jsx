import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PaginationControls from "../../../components/ui/PaginationControls";

import { deleteSchedule, getSchedules } from "../../../services/scheduleService";

import { confirmDelete } from "../../../utils/confirm";
import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import useRoleBase from "../../../hooks/useRoleBase";

export default function SchedulesPage() {
  const roleBase = useRoleBase();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("day-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadSchedules() {
    try {
      const data = await getSchedules();
      setSchedules(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
  }, []);

  const filteredSchedules = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = schedules.filter((schedule) => {
      if (!search) return true;

      return [schedule.doctor_name, schedule.specialist, schedule.day]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    const [field, order] = sortBy.split("-");

    return filtered.sort((a, b) => {
      const first = String(a[field] ?? "").toLowerCase();
      const second = String(b[field] ?? "").toLowerCase();

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [schedules, keyword, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchedules.length / pageSize),
  );
  const paginatedSchedules = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSchedules.slice(start, start + pageSize);
  }, [filteredSchedules, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("jadwal"))) return;

    try {
      await deleteSchedule(id);

      setSchedules((current) =>
        current.filter((schedule) => schedule.id !== id),
      );

      toast.success("Jadwal berhasil dihapus");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus jadwal");
    }
  };

  return (
    <DashboardLayout
      title="Kelola Jadwal"
      subtitle="Daftar jadwal praktik dokter"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari jadwal..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
          </div>

          <Input
            type="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[180px]"
          >
            <option value="day-asc">Hari A-Z</option>
            <option value="day-desc">Hari Z-A</option>
            <option value="doctor_name-asc">Dokter A-Z</option>
            <option value="doctor_name-desc">Dokter Z-A</option>
          </Input>
        </div>

        <Link
          to={`${roleBase}/schedules/new`}
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Jadwal
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data jadwal...
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada data jadwal yang cocok.
          </div>
        ) : (
          paginatedSchedules.map((schedule) => (
            <Card key={schedule.id} className="p-5">
              {/* Header */}

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {schedule.doctor_name}
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

              {/* Detail */}

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

              {/* Action */}

              <div className="mt-5 flex gap-2">
                <Link
                  to={`${roleBase}/schedules/${schedule.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`${roleBase}/schedules/${schedule.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white hover:opacity-90"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(schedule.id)}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500 p-2.5 text-white hover:opacity-90"
                >
                  <Trash2 size={16} />
                </button>
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
        totalItems={filteredSchedules.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
