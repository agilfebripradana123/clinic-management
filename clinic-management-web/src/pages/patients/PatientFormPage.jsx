import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  createPatient,
  getPatient,
  updatePatient,
} from "../../services/patientService";
import { toast } from "../../utils/toast";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  gender: "L",
  birth_date: "",
  address: "",
  is_active: true,
};

export default function PatientFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    async function loadPatient() {
      if (!isEditMode) {
        setInitialLoading(false);
        return;
      }

      try {
        const patient = await getPatient(id);
        setForm({
          name: patient.name || "",
          email: patient.email || "",
          password: "",
          phone: patient.phone || "",
          medical_record_number: patient.medical_record_number || "",
          gender: patient.gender || "L",
          birth_date: patient.birth_date || "",
          address: patient.address || "",
          is_active: patient.is_active ?? true,
        });
      } finally {
        setInitialLoading(false);
      }
    }

    loadPatient();
  }, [id, isEditMode]);

  const handleChange =
    (field) =>
    ({ target }) => {
      setForm((current) => ({ ...current, [field]: target.value }));
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await updatePatient(id, form);
        toast.success(`Pasien ${form.name || "baru"} berhasil diperbarui`);
      } else {
        await createPatient(form);
        toast.success(`Pasien ${form.name || "baru"} berhasil disimpan`);
      }

      navigate("/patients");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditMode ? "Gagal memperbarui pasien" : "Gagal menyimpan pasien"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? "Edit Pasien" : "Form Pasien"}
      subtitle={
        isEditMode ? "Perbarui data pasien" : "Tambah atau edit data pasien"
      }
    >
      <Card className="mx-auto max-w-4xl p-4 sm:p-6 md:p-8">
        {initialLoading ? (
          <p className="text-sm text-slate-500">Memuat data pasien...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input
                  label="Nama Pasien"
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Masukkan nama pasien"
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="pasien@clinic.com"
              />
              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder={
                  isEditMode
                    ? "Kosongkan jika tidak ingin mengubah password"
                    : "Minimal 8 karakter"
                }
              />
              <Input
                label="Nomor Telepon"
                value={form.phone}
                onChange={handleChange("phone")}
                placeholder="0812xxxx"
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#0f172a]">
                  Jenis Kelamin
                </label>
                <select
                  value={form.gender}
                  onChange={handleChange("gender")}
                  className="h-14 w-full rounded-2xl border border-[#e2e8f0] bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-[#00d0ff] focus:bg-white focus:ring-4 focus:ring-[#00d0ff]/20"
                >
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <Input
                label="Tanggal Lahir"
                type="date"
                value={form.birth_date}
                onChange={handleChange("birth_date")}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={form.is_active ? "1" : "0"}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_active: e.target.value === "1",
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="1">Aktif</option>
                  <option value="0">Tidak Aktif</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#0f172a]">
                  Alamat
                </label>
                <textarea
                  label="Alamat"
                  value={form.address}
                  onChange={handleChange("address")}
                  placeholder="Masukkan alamat"
                  maxLength={255}
                  className="w-full rounded-2xl border border-[#e2e8f0] bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-[#00d0ff] focus:bg-white focus:ring-4 focus:ring-[#00d0ff]/20"
                />
                <p className="mt-1 text-right text-xs text-slate-400">
                  {form.address.length}/255 karakter
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-44"
              >
                {isEditMode ? "Update Pasien" : "Simpan Pasien"}
              </Button>
              <button
                type="button"
                onClick={() => navigate("/patients")}
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
