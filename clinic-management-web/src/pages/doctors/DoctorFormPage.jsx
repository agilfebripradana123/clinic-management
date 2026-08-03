import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  createDoctor,
  getDoctor,
  updateDoctor,
} from "../../services/doctorService";
import { toast } from "../../utils/toast";
import useRoleBase from "../../hooks/useRoleBase";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  specialty: "",
  phone: "",
  address: "",
  is_active: true,
};

export default function DoctorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleBase = useRoleBase();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    async function loadDoctor() {
      if (!isEditMode) {
        setInitialLoading(false);
        return;
      }

      try {
        const doctor = await getDoctor(id);
        setForm({
          name: doctor.name || "",
          email: doctor.email || "",
          password: "",
          specialty: doctor.specialty || "",
          phone: doctor.phone || "",
          address: doctor.address || "",
          license_number: doctor.license_number || "",
          is_active: doctor.is_active ?? true,
        });
      } finally {
        setInitialLoading(false);
      }
    }

    loadDoctor();
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
        await updateDoctor(id, form);
        toast.success(`Dokter ${form.name || "baru"} berhasil diperbarui`);
      } else {
        await createDoctor(form);
        toast.success(`Dokter ${form.name || "baru"} berhasil disimpan`);
      }

      navigate(`${roleBase}/doctors`);
    } catch (error) {
      console.log(error.response?.data);

      toast.error(error.response?.data?.message || "Gagal memperbarui dokter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      title={isEditMode ? "Edit Dokter" : "Form Dokter"}
      subtitle={
        isEditMode ? "Perbarui data dokter" : "Tambah atau edit data dokter"
      }
    >
      <Card className="mx-auto max-w-2xl p-6 md:p-8">
        {initialLoading ? (
          <p className="text-sm text-slate-500">Memuat data dokter...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nama Dokter"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Masukkan nama dokter"
            />
            <Input
              label="Nomor SIP"
              value={form.license_number}
              onChange={handleChange("license_number")}
              placeholder="SIP-001"
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="dokter@clinic.com"
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
              label="Spesialis"
              value={form.specialty}
              onChange={handleChange("specialty")}
              placeholder="Dokter Umum"
            />
            <Input
              label="Nomor Telepon"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="0812xxxx"
            />
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

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                loading={loading}
                className="w-full sm:w-44"
              >
                {isEditMode ? "Update Dokter" : "Simpan Dokter"}
              </Button>
              <button
                type="button"
                onClick={() => navigate(`${roleBase}/doctors`)}
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
