import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

import { getUser } from "../../services/userService";
import { formatDate } from "../../utils/format";
import { toast } from "../../utils/toast";
import useRoleBase from "../../hooks/useRoleBase";

export default function UserDetailPage() {
  const { id } = useParams();
  const roleBase = useRoleBase();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser(id);
        setUser(data);
      } catch (error) {
        toast.error("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge color="purple">Admin</Badge>;

      case "doctor":
        return <Badge color="info">Dokter</Badge>;

      case "patient":
        return <Badge color="success">Pasien</Badge>;

      default:
        return <Badge color="gray">{role}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Detail User" subtitle="Memuat data user...">
        <Card className="p-6">Memuat data...</Card>
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout title="Detail User" subtitle="Data tidak ditemukan">
        <Card className="p-6">User tidak ditemukan.</Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Detail User"
      subtitle="Informasi lengkap akun pengguna"
    >
      <Card className="max-w-4xl p-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>

            <p className="mt-1 text-slate-500">{user.email}</p>
          </div>

          {roleBadge(user.role)}
        </div>

        {/* Detail */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Nama</p>

            <p className="mt-1 font-medium text-slate-900">{user.name}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Role</p>

            <div className="mt-1">{roleBadge(user.role)}</div>
          </div>

          <div>
            <p className="text-sm text-slate-500">Email</p>

            <p className="mt-1 font-medium text-slate-900">{user.email}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Tanggal Dibuat</p>

            <p className="mt-1 font-medium text-slate-900">
              {formatDate(user.created_at)}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Terakhir Diperbarui</p>

            <p className="mt-1 font-medium text-slate-900">
              {formatDate(user.updated_at)}
            </p>
          </div>
        </div>

        {/* Action */}
        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Link to={`${roleBase}/users`}>
            <Button variant="secondary" fullWidth={false} icon={ArrowLeft}>
              Kembali
            </Button>
          </Link>

          <Link to={`${roleBase}/users/${user.id}/edit`}>
            <Button variant="success" fullWidth={false} icon={Pencil}>
              Edit User
            </Button>
          </Link>
        </div>
      </Card>
    </DashboardLayout>
  );
}
