import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";
import useRoleBase from "../../../hooks/useRoleBase";

import { getPatients, deletePatient } from "../../../services/patientService";

import { toast } from "../../../utils/toast";
import { confirmDelete } from "../../../utils/confirm";
import { formatDate } from "../../../utils/format";

export default function PatientsPage() {
  const roleBase = useRoleBase();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [filterActive, setFilterActive] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadPatients = useCallback(async () => {
    setLoading(true);

    try {
      const [sortField, sortDir] = sortBy.split("-");
      const result = await getPatients({
        page: currentPage,
        per_page: pageSize,
        search: keyword,
        sort_by: sortField,
        sort_dir: sortDir,
        ...(filterActive ? { is_active: filterActive === "true" } : {}),
      });

      setPatients(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data pasien");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword, sortBy, filterActive]);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, filterActive, pageSize]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("pasien"))) return;

    try {
      await deletePatient(id);

      setPatients((current) => current.filter((patient) => patient.id !== id));
      setTotal((current) => Math.max(0, current - 1));

      toast.success("Pasien berhasil dihapus");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus pasien");
    }
  };

  return (
    <DashboardLayout
      title="Kelola Pasien"
      subtitle="Daftar seluruh pasien yang terdaftar"
    >
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari nama, email, atau nomor RM..."
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
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="min-w-[150px]"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </Input>
        </div>

        <Link
          to={`${roleBase}/patients/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Pasien
        </Link>
      </div>

      {/* Tabel */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  No. RM
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Tanggal Lahir
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Telepon
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Memuat data pasien...
                  </td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Tidak ada data pasien yang cocok.
                  </td>
                </tr>
              ) : (
                patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">
                        {patient.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {patient.email || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {patient.medical_record_number || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(patient.birth_date)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {patient.phone || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {patient.is_active ? (
                        <Badge color="success">Aktif</Badge>
                      ) : (
                        <Badge color="danger">Nonaktif</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`${roleBase}/patients/${patient.id}`}
                          className="rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                          title="Detail"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          to={`${roleBase}/patients/${patient.id}/edit`}
                          className="rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(patient.id)}
                          className="rounded-xl bg-rose-500 p-2.5 text-white transition hover:opacity-90"
                          title="Hapus"
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
