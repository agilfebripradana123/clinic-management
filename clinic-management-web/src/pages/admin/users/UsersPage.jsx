import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Plus, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";
import Input from "../../../components/ui/Input";
import PaginationControls from "../../../components/ui/PaginationControls";

import { deleteUser, getUsers } from "../../../services/userService";

import { toast } from "../../../utils/toast";
import { confirmDelete } from "../../../utils/confirm";

import { formatDate } from "../../../utils/format";
import useRoleBase from "../../../hooks/useRoleBase";

export default function UsersPage() {
  const roleBase = useRoleBase();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const [sortField, sortDir] = sortBy.split("-");
      const result = await getUsers({
        page: currentPage,
        per_page: pageSize,
        search: keyword,
        sort_by: sortField,
        sort_dir: sortDir,
        ...(filterRole ? { role: filterRole } : {}),
      });

      setUsers(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword, sortBy, filterRole]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, filterRole, pageSize]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("user"))) return;

    try {
      await deleteUser(id);

      setUsers((current) => current.filter((user) => user.id !== id));
      setTotal((current) => Math.max(0, current - 1));

      toast.success("User berhasil dihapus");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus user");
    }
  };

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

  return (
    <DashboardLayout title="Kelola User" subtitle="Kelola akun pengguna sistem">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
          <div className="w-full md:max-w-sm">
            <Input
              placeholder="Cari nama, email, atau role..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
          </div>

          <Input
            type="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[180px]"
          >
            <option value="created_at-desc">Terbaru</option>
            <option value="created_at-asc">Terlama</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
          </Input>

          <Input
            type="select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="doctor">Dokter</option>
            <option value="patient">Pasien</option>
          </Input>
        </div>

        <Link to={`${roleBase}/users/new`}>
          <Button fullWidth={false} icon={Plus}>
            Tambah Admin
          </Button>
        </Link>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Nama
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Email
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Role
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Dibuat
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Memuat data user...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Tidak ada data user.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-slate-600">{user.email}</td>

                    <td className="px-6 py-4 text-center">
                      {roleBadge(user.role)}
                    </td>

                    <td className="px-6 py-4 text-center text-slate-600">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`${roleBase}/users/${user.id}`}
                          className="rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          to={`${roleBase}/users/${user.id}/edit`}
                          className="rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="rounded-xl bg-rose-500 p-2.5 text-white transition hover:opacity-90"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

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
