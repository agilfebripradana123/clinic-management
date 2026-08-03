import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

import { getBooking } from "../../services/bookingService";
import { DAY_LABELS } from "../../utils/day";
import { formatDate } from "../../utils/format";
import useRoleBase from "../../hooks/useRoleBase";

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await getBooking(id);
        setBooking(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBooking();
  }, [id]);

  return (
    <DashboardLayout
      title="Detail Booking"
      subtitle="Informasi lengkap booking pemeriksaan"
    >
      <Card className="mx-auto max-w-3xl p-6 md:p-8">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat data booking...</p>
        ) : !booking ? (
          <p className="text-sm text-rose-500">Booking tidak ditemukan.</p>
        ) : (
          <>
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {booking.patient_name}
                </h2>

                <p className="text-slate-500">{booking.booking_code}</p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  booking.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {booking.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Info label="Nama Pasien" value={booking.patient_name} />

              <Info label="Dokter" value={booking.doctor_name} />

              <Info label="Spesialis" value={booking.specialist} />

              <Info
                label="Hari"
                value={DAY_LABELS[booking.day] || booking.day}
              />

              <Info
                label="Jam"
                value={`${booking.start_time} - ${booking.end_time}`}
              />

              <Info
                label="Tanggal Booking"
                value={formatDate(booking.booking_date)}
              />

              <Info label="Nomor Antrian" value={booking.queue_number} />

              <Info label="Kode Booking" value={booking.booking_code} />

              <div className="md:col-span-2">
                <Info label="Catatan" value={booking.notes || "-"} />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                onClick={() => navigate(`${roleBase}/bookings/${booking.id}/edit`)}
                className="w-full sm:w-44"
              >
                Edit Booking
              </Button>

              <button
                onClick={() => navigate(`${roleBase}/bookings`)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-44"
              >
                Kembali
              </button>
            </div>
          </>
        )}
      </Card>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
