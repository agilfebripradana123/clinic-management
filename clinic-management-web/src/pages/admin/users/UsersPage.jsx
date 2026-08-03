import { useEffect, useMemo, useState } from "react";
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
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadUsers() {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = users.filter((user) => {
      if (!search) return true;

      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.role || "").toLowerCase().includes(search)
      );
    });

    const [field, order] = sortBy.split("-");

    return filtered.sort((a, b) => {
      const first = String(a[field] ?? "").toLowerCase();
      const second = String(b[field] ?? "").toLowerCase();

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [users, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("user"))) return;

    try {
      await deleteUser(id);

      setUsers((current) => current.filter((user) => user.id !== id));

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
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
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
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    Tidak ada data user.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => (
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
        totalItems={filteredUsers.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
