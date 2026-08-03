import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";
import useRoleBase from "../../../hooks/useRoleBase";

import { deleteBooking, getBookings } from "../../../services/bookingService";

import { toast } from "../../../utils/toast";
import { confirmDelete } from "../../../utils/confirm";
import { formatDate } from "../../../utils/format";

const statusMeta = {
  pending: { label: "Menunggu", color: "warning" },
  confirmed: { label: "Dikonfirmasi", color: "info" },
  completed: { label: "Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" },
};

export default function BookingsPage() {
  const roleBase = useRoleBase();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadBookings = useCallback(async () => {
    setLoading(true);

    try {
      const [sortField, sortDir] = sortBy.split("-");
      const result = await getBookings({
        page: currentPage,
        per_page: pageSize,
        search: keyword,
        sort_by: sortField,
        sort_dir: sortDir,
        ...(filterStatus ? { status: filterStatus } : {}),
      });

      setBookings(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data booking");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword, sortBy, filterStatus]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, filterStatus, pageSize]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("booking"))) return;

    try {
      await deleteBooking(id);

      setBookings((current) => current.filter((booking) => booking.id !== id));
      setTotal((current) => Math.max(0, current - 1));

      toast.success("Booking berhasil dihapus");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus booking");
    }
  };

  return (
    <DashboardLayout
      title="Kelola Booking"
      subtitle="Daftar booking pemeriksaan pasien"
    >
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari kode booking, pasien, atau dokter..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
          </div>

          <Input
            type="select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="min-w-[170px]"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="confirmed">Dikonfirmasi</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </Input>

          <Input
            type="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[180px]"
          >
            <option value="created_at-desc">Terbaru</option>
            <option value="created_at-asc">Terlama</option>
            <option value="booking_date-desc">Tanggal Terbaru</option>
            <option value="booking_date-asc">Tanggal Terlama</option>
          </Input>
        </div>

        <Link
          to={`${roleBase}/bookings/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Booking
        </Link>
      </div>

      {/* Tabel */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Kode
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Pasien
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Dokter
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Antrian
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Memuat data booking...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Tidak ada data booking yang cocok.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const status = statusMeta[booking.status] || {
                    label: booking.status,
                    color: "gray",
                  };

                  return (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {booking.booking_code || "-"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {booking.patient_name || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-slate-700">
                          {booking.doctor_name || "-"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.specialist || ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {formatDate(booking.booking_date)}
                      </td>
                      <td className="px-6 py-4 text-center text-slate-600">
                        {booking.queue_number || "-"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge color={status.color}>{status.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`${roleBase}/bookings/${booking.id}`}
                            className="rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                            title="Detail"
                          >
                            <Eye size={16} />
                          </Link>

                          <Link
                            to={`${roleBase}/bookings/${booking.id}/edit`}
                            className="rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(booking.id)}
                            className="rounded-xl bg-rose-500 p-2.5 text-white transition hover:opacity-90"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
