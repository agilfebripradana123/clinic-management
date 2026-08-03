import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import {
  createBooking,
  getBooking,
  updateBooking,
} from "../../../services/bookingService";

import { getDoctors } from "../../../services/doctorService";
import { getSchedules } from "../../../services/scheduleService";

import { toast } from "../../../utils/toast";
import { DAY_LABELS } from "../../../utils/day";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

const defaultForm = {
  doctor_id: "",
  schedule_id: "",
  booking_date: "",
  notes: "",
};

export default function BookingFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleBase = useRoleBase();
  const { user } = useAuth();

  const isEdit = Boolean(id);
  const patientId = user?.patient_id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const [doctorOptions, setDoctorOptions] = useState([]);
  const [scheduleOptions, setScheduleOptions] = useState([]);

  const [form, setForm] = useState(defaultForm);
  const [savedPatientId, setSavedPatientId] = useState("");
  const [savedStatus, setSavedStatus] = useState("pending");

  useEffect(() => {
    async function loadMasterData() {
      try {
        const [doctors, schedules] = await Promise.all([
          getDoctors(),
          getSchedules(),
        ]);

        setDoctorOptions(doctors.data);
        setScheduleOptions(schedules.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadMasterData();
  }, []);

  useEffect(() => {
    async function loadBooking() {
      if (!isEdit) {
        setInitialLoading(false);
        return;
      }

      try {
        const booking = await getBooking(id);

        setForm({
          doctor_id: booking.doctor_id ?? "",
          schedule_id: booking.schedule_id ?? "",
          booking_date: booking.booking_date ?? "",
          notes: booking.notes ?? "",
        });

        // Simpan pasien & status asli agar tidak berubah saat edit.
        setSavedPatientId(booking.patient_id ?? "");
        setSavedStatus(booking.status ?? "pending");
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    }

    loadBooking();
  }, [id, isEdit]);

  const filteredSchedules = useMemo(() => {
    if (!form.doctor_id) return [];

    return scheduleOptions.filter(
      (schedule) => Number(schedule.doctor_id) === Number(form.doctor_id),
    );
  }, [scheduleOptions, form.doctor_id]);

  useEffect(() => {
    if (!form.doctor_id) return;

    const exists = filteredSchedules.some(
      (item) => Number(item.id) === Number(form.schedule_id),
    );

    if (!exists) {
      setForm((prev) => ({
        ...prev,
        schedule_id: "",
      }));
    }
  }, [filteredSchedules]);

  const handleChange =
    (field) =>
    ({ target }) => {
      setForm((prev) => ({
        ...prev,
        [field]: target.value,
      }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Pasien selalu booking untuk dirinya sendiri, status awal pending.
      const payload = {
        doctor_id: Number(form.doctor_id),
        patient_id: isEdit ? Number(savedPatientId) : Number(patientId),
        schedule_id: Number(form.schedule_id),
        booking_date: form.booking_date,
        status: isEdit ? savedStatus : "pending",
        notes: form.notes,
      };

      if (isEdit) {
        await updateBooking(id, payload);
        toast.success("Booking berhasil diperbarui");
      } else {
        await createBooking(payload);
        toast.success("Booking berhasil ditambahkan");
      }

      navigate(`${roleBase}/bookings`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ??
          "Terjadi kesalahan saat menyimpan booking.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout
      title={isEdit ? "Edit Booking" : "Tambah Booking"}
      subtitle={
        isEdit
          ? "Perbarui data booking pemeriksaan"
          : "Buat booking pemeriksaan baru"
      }
    >
      <Card className="mx-auto max-w-3xl p-6 md:p-8">
        {initialLoading ? (
          <p className="text-sm text-slate-500">Memuat data booking...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Pasien
                </label>

                <input
                  value={user?.name || "Pasien"}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Dokter
                </label>

                <select
                  value={form.doctor_id}
                  onChange={handleChange("doctor_id")}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                  required
                >
                  <option value="">Pilih Dokter</option>

                  {doctorOptions.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} • {doctor.specialist}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Jadwal Dokter
                </label>

                <select
                  value={form.schedule_id}
                  onChange={handleChange("schedule_id")}
                  disabled={!form.doctor_id}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500 disabled:bg-slate-100"
                  required
                >
                  <option value="">
                    {form.doctor_id
                      ? "Pilih Jadwal"
                      : "Pilih Dokter terlebih dahulu"}
                  </option>

                  {filteredSchedules.map((schedule) => (
                    <option key={schedule.id} value={schedule.id}>
                      {DAY_LABELS[schedule.day] ?? schedule.day}
                      {" • "}
                      {schedule.time}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Tanggal Booking"
                type="date"
                value={form.booking_date}
                onChange={handleChange("booking_date")}
                required
              />

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <input
                  value={isEdit ? (savedStatus === "pending" ? "Menunggu" : savedStatus) : "Menunggu"}
                  disabled
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Catatan
                </label>

                <textarea
                  rows={4}
                  value={form.notes}
                  onChange={handleChange("notes")}
                  placeholder="Masukkan catatan jika diperlukan..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-44"
              >
                {isEdit ? "Update Booking" : "Simpan Booking"}
              </Button>

              <button
                type="button"
                onClick={() => navigate(`${roleBase}/bookings`)}
                className="w-full rounded-2xl border border-slate-300 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-100 sm:w-44"
              >
                Batal
              </button>
            </div>
          </form>
        )}
      </Card>
    </DashboardLayout>
  );
}
