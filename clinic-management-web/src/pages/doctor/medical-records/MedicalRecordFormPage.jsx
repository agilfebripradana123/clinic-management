import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

import api from "../../../services/api";

import {
  createMedicalRecord,
  getMedicalRecord,
  updateMedicalRecord,
} from "../../../services/medicalRecordService";

import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

const defaultForm = {
  booking_id: "",
  complaint: "",
  diagnosis: "",
  treatment: "",
  prescription: "",
  notes: "",
};

export default function MedicalRecordFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    async function initialize() {
      await loadBookings();

      if (isEditMode) {
        await loadMedicalRecord();
      }

      setInitialLoading(false);
    }

    initialize();
  }, [id]);

  async function loadBookings() {
    try {
      const params = doctorId ? `?doctor_id=${doctorId}` : "";
      const response = await api.get(
        `/medical-records/available-bookings${params}`,
      );
      setBookings(response.data);
    } catch (error) {
      toast.error("Gagal mengambil data booking.");
    }
  }

  async function loadMedicalRecord() {
    try {
      const data = await getMedicalRecord(id);

      setForm({
        booking_id: data.booking_id || "",
        complaint: data.complaint || "",
        diagnosis: data.diagnosis || "",
        treatment: data.treatment || "",
        prescription: data.prescription || "",
        notes: data.notes || "",
      });
    } catch (error) {
      toast.error("Gagal mengambil data rekam medis.");
    }
  }

  const selectedBooking = useMemo(() => {
    return bookings.find((item) => Number(item.id) === Number(form.booking_id));
  }, [bookings, form.booking_id]);

  const handleChange =
    (field) =>
    ({ target }) => {
      setForm((current) => ({
        ...current,
        [field]: target.value,
      }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await updateMedicalRecord(id, form);

        toast.success("Rekam medis berhasil diperbarui");
      } else {
        await createMedicalRecord(form);

        toast.success("Rekam medis berhasil ditambahkan");
      }

      navigate(`${roleBase}/medical-records`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditMode
            ? "Gagal memperbarui rekam medis"
            : "Gagal menyimpan rekam medis"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? "Edit Rekam Medis" : "Form Rekam Medis"}
      subtitle={
        isEditMode
          ? "Perbarui data rekam medis pasien"
          : "Tambah data rekam medis pasien"
      }
    >
      <Card className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        {initialLoading ? (
          <p className="text-sm text-slate-500">Memuat data rekam medis...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0f172a]">
                  Booking
                </label>

                <select
                  value={form.booking_id}
                  onChange={handleChange("booking_id")}
                  disabled={isEditMode}
                  className="mt-2 h-14 w-full rounded-2xl border border-[#e2e8f0] bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-[#00d0ff] focus:bg-white focus:ring-4 focus:ring-[#00d0ff]/20 disabled:bg-slate-100"
                >
                  <option value="">Pilih Booking</option>

                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.booking_code} - {booking.patient.user.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBooking && (
                <div className="md:col-span-2 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Pasien</p>
                      <p className="font-semibold">
                        {selectedBooking.patient.user.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Dokter</p>
                      <p className="font-semibold">
                        {selectedBooking.doctor.user.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Tanggal Booking</p>
                      <p className="font-semibold">
                        {selectedBooking.booking_date}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Jadwal</p>
                      <p className="font-semibold">
                        {selectedBooking.schedule?.day} •{" "}
                        {selectedBooking.schedule?.start_time} -
                        {selectedBooking.schedule?.end_time}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Input
                label="Keluhan"
                value={form.complaint}
                onChange={handleChange("complaint")}
                placeholder="Masukkan keluhan pasien"
              />

              <Input
                label="Diagnosa"
                value={form.diagnosis}
                onChange={handleChange("diagnosis")}
                placeholder="Masukkan diagnosa"
              />

              <Input
                label="Tindakan"
                value={form.treatment}
                onChange={handleChange("treatment")}
                placeholder="Masukkan tindakan"
              />

              <Input
                label="Resep"
                value={form.prescription}
                onChange={handleChange("prescription")}
                placeholder="Masukkan resep obat"
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0f172a]">
                  Catatan
                </label>

                <textarea
                  value={form.notes}
                  onChange={handleChange("notes")}
                  rows={4}
                  placeholder="Masukkan catatan tambahan..."
                  className="mt-2 w-full rounded-2xl border border-[#e2e8f0] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-[#00d0ff] focus:bg-white focus:ring-4 focus:ring-[#00d0ff]/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-52"
              >
                {isEditMode ? "Update Rekam Medis" : "Simpan Rekam Medis"}
              </Button>

              <button
                type="button"
                onClick={() => navigate(`${roleBase}/medical-records`)}
                className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 sm:w-44"
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
