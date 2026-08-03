import { useCallback, useEffect, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";

import { getBookings, updateBookingStatus } from "../../../services/bookingService";

import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import { formatDate } from "../../../utils/format";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

const statusMeta = {
  pending: { label: "Menunggu", color: "warning" },
  confirmed: { label: "Diproses", color: "info" },
  completed: { label: "Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" },
};

export default function BookingsPage() {
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [updatingId, setUpdatingId] = useState(null);

  const loadBookings = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getBookings({
        doctor_id: doctorId,
        page: currentPage,
        per_page: pageSize,
        search: keyword,
      });

      setBookings(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data booking");
    } finally {
      setLoading(false);
    }
  }, [doctorId, currentPage, pageSize, keyword]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, pageSize]);

  const handleStatusChange = async (bookingId, nextStatus) => {
    setUpdatingId(bookingId);

    try {
      await updateBookingStatus(bookingId, nextStatus);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: nextStatus }
            : booking,
        ),
      );

      toast.success("Status booking diperbarui");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout
      title="Booking Saya"
      subtitle="Daftar booking pemeriksaan pasien kepada Anda"
    >
      <div className="mb-5 w-full md:w-72">
        <Input
          placeholder="Cari kode booking atau pasien..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          icon={Search}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data booking...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Belum ada booking untuk Anda.
          </div>
        ) : (
          bookings.map((booking) => {
            const status = statusMeta[booking.status] || {
              label: booking.status,
              color: "gray",
            };

            return (
              <Card
                key={booking.id}
                className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {booking.booking_code || "-"}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {booking.patient_name || "-"}
                    </p>
                  </div>

                  <Badge color={status.color}>{status.label}</Badge>
                </div>

                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal</span>

                    <span>{formatDate(booking.booking_date)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Hari</span>

                    <span>{DAY_LABELS[booking.day] ?? booking.day ?? "-"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Jam</span>

                    <span>
                      {booking.start_time || "-"} - {booking.end_time || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Antrian</span>

                    <span>{booking.queue_number || "-"}</span>
                  </div>
                </div>

                {/* Ubah status */}
                <div className="mt-5">
                  <label className="mb-1 block text-xs font-semibold text-slate-500">
                    Ubah Status
                  </label>

                  <div className="flex items-center gap-2">
                    <select
                      value={booking.status}
                      disabled={updatingId === booking.id}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-cyan-500 disabled:bg-slate-100"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="confirmed">Diproses</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>

                    <Link
                      to={`${roleBase}/bookings/${booking.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                      title="Detail"
                    >
                      <Eye size={16} />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })
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
