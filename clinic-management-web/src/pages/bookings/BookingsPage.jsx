import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PaginationControls from "../../components/ui/PaginationControls";
import useAuth from "../../hooks/useAuth";

import { deleteBooking, getBookings } from "../../services/bookingService";

import { toast } from "../../utils/toast";
import { confirmDelete } from "../../utils/confirm";
import { DAY_LABELS } from "../../utils/day";
import { formatDate } from "../../utils/format";

export default function BookingsPage() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";
  const doctorId = user?.doctor?.id;
  const patientId = user?.patient?.id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("booking_date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadBookings() {
    try {
      const data = await getBookings();
      setBookings(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = bookings.filter((booking) => {
      if (!search) return true;

      return [
        booking.patient_name,
        booking.doctor_name,
        booking.booking_code,
        booking.specialist,
        booking.status,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    const [field, order] = sortBy.split("-");

    return filtered.sort((a, b) => {
      const first = String(a[field] ?? "").toLowerCase();
      const second = String(b[field] ?? "").toLowerCase();

      if (field === "booking_date") {
        return order === "asc"
          ? new Date(a.booking_date) - new Date(b.booking_date)
          : new Date(b.booking_date) - new Date(a.booking_date);
      }

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [bookings, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("booking"))) return;

    try {
      await deleteBooking(id);

      setBookings((current) => current.filter((booking) => booking.id !== id));

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
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari booking..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
          </div>

          <Input
            type="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="booking_date-desc">Tanggal Terbaru</option>
            <option value="booking_date-asc">Tanggal Terlama</option>
            <option value="patient_name-asc">Pasien A-Z</option>
            <option value="patient_name-desc">Pasien Z-A</option>
          </Input>
        </div>

        <Link
          to="/bookings/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Booking
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data booking...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada data booking yang cocok.
          </div>
        ) : (
          paginatedBookings.map((booking) => (
            <Card key={booking.id} className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {booking.patient_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {booking.booking_code}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    booking.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : booking.status === "confirmed"
                        ? "bg-sky-100 text-sky-700"
                        : booking.status === "cancelled"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.status === "pending"
                    ? "Menunggu"
                    : booking.status === "confirmed"
                      ? "Dikonfirmasi"
                      : booking.status === "completed"
                        ? "Selesai"
                        : booking.status === "cancelled"
                          ? "Dibatalkan"
                          : booking.status}
                </span>
              </div>

              {/* Detail */}
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dokter</span>

                  <span className="font-medium">{booking.doctor_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Spesialis</span>

                  <span>{booking.specialist}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Hari</span>

                  <span>{DAY_LABELS[booking.day] ?? booking.day ?? "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Jam</span>

                  <span>
                    {booking.time ||
                      `${booking.start_time ?? "-"} - ${booking.end_time ?? "-"}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>

                  <span>{formatDate(booking.booking_date)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Nomor Antrian</span>

                  <span>{booking.queue_number || "-"}</span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 flex gap-2">
                <Link
                  to={`/bookings/${booking.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`/bookings/${booking.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white hover:opacity-90"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(booking.id)}
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
        totalItems={filteredBookings.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
