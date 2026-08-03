import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { DAY_LABELS } from "../../../utils/day";
import {
  createSchedule,
  getSchedule,
  updateSchedule,
} from "../../../services/scheduleService";

import { getDoctors } from "../../../services/doctorService";
import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const defaultForm = {
  doctor_id: "",
  day: "Monday",
  start_time: "",
  end_time: "",
  is_active: true,
};

export default function ScheduleFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleBase = useRoleBase();

  const isEdit = Boolean(id);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    loadDoctors();

    if (isEdit) {
      loadSchedule();
    } else {
      setLoadingData(false);
    }
  }, [id, isEdit]);

  async function loadDoctors() {
    try {
      const data = await getDoctors();
      setDoctors(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data dokter.");
    }
  }

  async function loadSchedule() {
    try {
      const data = await getSchedule(id);

      setForm({
        doctor_id: data.doctor_id,
        day: data.day,
        start_time: data.start_time,
        end_time: data.end_time,
        is_active: data.is_active,
      });
    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat jadwal.");
      navigate(`${roleBase}/schedules`);
    } finally {
      setLoadingData(false);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      if (isEdit) {
        await updateSchedule(id, form);
        toast.success("Jadwal berhasil diperbarui.");
      } else {
        await createSchedule(form);
        toast.success("Jadwal berhasil ditambahkan.");
      }

      navigate(`${roleBase}/schedules`);
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan jadwal.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <DashboardLayout title="Jadwal Praktik" subtitle="Memuat data...">
        <Card className="p-6">Memuat...</Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEdit ? "Edit Jadwal" : "Tambah Jadwal"}
      subtitle="Kelola jadwal praktik dokter"
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">Dokter</label>

            <select
              name="doctor_id"
              value={form.doctor_id}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
              required
            >
              <option value="">Pilih Dokter</option>

              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                  {doctor.specialist ? ` - ${doctor.specialist}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Hari</label>

            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {DAY_LABELS[day]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Jam Mulai"
              type="time"
              name="start_time"
              value={form.start_time}
              onChange={handleChange}
              required
            />

            <Input
              label="Jam Selesai"
              type="time"
              name="end_time"
              value={form.end_time}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />

            <span>Jadwal Aktif</span>
          </label>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="submit" loading={loading} className="w-full sm:w-44">
              {isEdit ? "Update Jadwal" : "Simpan Jadwal"}
            </Button>

            <button
              type="button"
              onClick={() => navigate(`${roleBase}/schedules`)}
              className="w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700 sm:w-44"
            >
              Batal
            </button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}
