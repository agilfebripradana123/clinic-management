import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

import {
  createUser,
  getUser,
  updateUser,
} from "../../../services/userService";

import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

export default function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleBase = useRoleBase();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!isEdit) return;

    async function loadUser() {
      try {
        const user = await getUser(id);

        setForm({
          name: user.name,
          email: user.email,
          password: "",
        });
      } catch {
        toast.error("Gagal memuat data user");
      } finally {
        setFetching(false);
      }
    }

    loadUser();
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isEdit) {
        await updateUser(id, form);

        toast.success("User berhasil diperbarui");
      } else {
        await createUser(form);

        toast.success("User berhasil ditambahkan");
      }

      navigate(`${roleBase}/users`);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Terjadi kesalahan."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <DashboardLayout
        title="Kelola User"
        subtitle="Memuat data..."
      >
        <Card className="p-6">
          Memuat data user...
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={isEdit ? "Edit User" : "Tambah Admin"}
      subtitle={
        isEdit
          ? "Perbarui informasi user"
          : "Tambahkan akun admin baru"
      }
    >
      <Card className="max-w-3xl p-6">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <Input
            label="Nama"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label={
              isEdit
                ? "Password Baru (Opsional)"
                : "Password"
            }
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required={!isEdit}
          />

          <div className="flex flex-wrap justify-end gap-3 pt-4">
            <Link to={`${roleBase}/users`}>
              <Button
                type="button"
                variant="secondary"
                fullWidth={false}
                icon={ArrowLeft}
              >
                Kembali
              </Button>
            </Link>

            <Button
              type="submit"
              loading={loading}
              fullWidth={false}
              icon={Save}
            >
              {isEdit ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </Card>
    </DashboardLayout>
  );
}