import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Badge from "../../../components/ui/Badge";

import { getBooking, updateBookingStatus } from "../../../services/bookingService";

import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import { formatDate } from "../../../utils/format";
import useRoleBase from "../../../hooks/useRoleBase";

const statusMeta = {
  pending: { label: "Menunggu", color: "warning" },
  confirmed: { label: "Diproses", color: "info" },
  completed: { label: "Selesai", color: "success" },
  cancelled: { label: "Dibatalkan", color: "danger" },
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  async function loadBooking() {
    try {
      const data = await getBooking(id);
      setBooking(data);
    } catch (error) {
      toast.error("Gagal memuat detail booking");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (nextStatus) => {
    try {
      await updateBookingStatus(id, nextStatus);
      setBooking((current) => ({ ...current, status: nextStatus }));
      toast.success("Status booking diperbarui");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah status");
    }
  };

  const status = booking ? statusMeta[booking.status] || {
    label: booking.status,
    color: "gray",
  } : null;

  return (
    <DashboardLayout
      title="Detail Booking"
      subtitle="Informasi booking pemeriksaan"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="p-6 md:p-8">
          {loading ? (
            <p className="text-sm text-slate-500">Memuat data booking...</p>
          ) : booking ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    {booking.booking_code}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    No. Antrian {booking.queue_number || "-"}
                  </p>
                </div>

                {status && <Badge color={status.color}>{status.label}</Badge>}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info label="Pasien" value={booking.patient_name} />
                <Info label="Dokter" value={booking.doctor_name} />
                <Info label="Spesialis" value={booking.specialist} />
                <Info label="Tanggal" value={formatDate(booking.booking_date)} />
                <Info
                  label="Hari"
                  value={DAY_LABELS[booking.day] ?? booking.day ?? "-"}
                />
                <Info
                  label="Jam"
                  value={`${booking.start_time || "-"} - ${booking.end_time || "-"}`}
                />
                <Info label="Catatan" value={booking.notes || "-"} />
              </div>

              {/* Ubah status */}
              <div className="mt-8 border-t pt-6">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Ubah Status
                </label>

                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                >
                  <option value="pending">Menunggu</option>
                  <option value="confirmed">Diproses</option>
                  <option value="completed">Selesai</option>
                  <option value="cancelled">Dibatalkan</option>
                </select>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">Booking tidak ditemukan.</p>
          )}
        </Card>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`${roleBase}/bookings`)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
