import { useCallback, useEffect, useState } from "react";
import { Eye, Plus, Search, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";
import useAuth from "../../../hooks/useAuth";
import useRoleBase from "../../../hooks/useRoleBase";

import { cancelBooking, getBookings } from "../../../services/bookingService";

import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import { formatDate } from "../../../utils/format";

const statusMeta = {
  pending: { label: "Menunggu", color: "warning" },
  confirmed: { label: "Dikonfirmasi", color: "info" },
  completed: { label: "Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" },
};

export default function BookingsPage() {
  const { user } = useAuth();
  const roleBase = useRoleBase();
  const patientId = user?.patient_id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadBookings = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getBookings({
        patient_id: patientId,
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
  }, [patientId, currentPage, pageSize, keyword]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, pageSize]);

  const handleCancel = async (id) => {
    try {
      await cancelBooking(id);

      setBookings((current) =>
        current.map((booking) =>
          booking.id === id ? { ...booking, status: "cancelled" } : booking,
        ),
      );

      toast.success("Booking dibatalkan");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal membatalkan booking");
    }
  };

  return (
    <DashboardLayout
      title="Booking Saya"
      subtitle="Daftar booking pemeriksaan Anda"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Cari kode booking atau dokter..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            icon={Search}
          />
        </div>

        <Link
          to={`${roleBase}/bookings/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Booking Baru
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data booking...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Belum ada booking.{" "}
            <Link
              to={`${roleBase}/bookings/new`}
              className="font-semibold text-cyan-600 hover:underline"
            >
              Buat booking sekarang
            </Link>
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
                      No. Antrian {booking.queue_number || "-"}
                    </p>
                  </div>

                  <Badge color={status.color}>{status.label}</Badge>
                </div>

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
                      {booking.start_time || "-"} - {booking.end_time || "-"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">Tanggal</span>

                    <span>{formatDate(booking.booking_date)}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-2">
                  <Link
                    to={`${roleBase}/bookings/${booking.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                    title="Detail"
                  >
                    <Eye size={16} />
                  </Link>

                  {booking.status === "pending" && (
                    <button
                      type="button"
                      onClick={() => handleCancel(booking.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-rose-500 px-3 py-2.5 text-xs font-semibold text-white hover:opacity-90"
                      title="Batalkan booking"
                    >
                      <XCircle size={14} />
                      Batalkan
                    </button>
                  )}
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
