import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PaginationControls from "../../components/ui/PaginationControls";

import { getPatients, deletePatient } from "../../services/patientService";

import { toast } from "../../utils/toast";
import { confirmDelete } from "../../utils/confirm";
import { formatDate } from "../../utils/format";

import useAuth from "../../hooks/useAuth";
import useRoleBase from "../../hooks/useRoleBase";

export default function PatientsPage() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";
  const roleBase = useRoleBase();
  const isAdmin = role === "admin";

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadPatients() {
    try {
      const data = await getPatients();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = patients.filter((patient) => {
      if (!search) return true;

      return [
        patient.name,
        patient.email,
        patient.medical_record_number,
        patient.phone,
        patient.address,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    const [field, order] = sortBy.split("-");

    return filtered.sort((a, b) => {
      const first = String(a[field] ?? "").toLowerCase();
      const second = String(b[field] ?? "").toLowerCase();

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [patients, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / pageSize));
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPatients.slice(start, start + pageSize);
  }, [filteredPatients, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("pasien"))) return;

    try {
      await deletePatient(id);

      setPatients((current) => current.filter((patient) => patient.id !== id));

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
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari pasien..."
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
            <option value="medical_record_number-asc">RM A-Z</option>
            <option value="medical_record_number-desc">RM Z-A</option>
          </Input>
        </div>

        {isAdmin && (
          <Link
            to={`${roleBase}/patients/new`}
            className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
          >
            <Plus size={16} />
            Tambah Pasien
          </Link>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data pasien...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada data pasien yang cocok.
          </div>
        ) : (
          paginatedPatients.map((patient) => (
            <Card key={patient.id} className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {patient.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {patient.email || "-"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    patient.is_active
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {patient.is_active ? "Aktif" : "Nonaktif"}
                </span>
              </div>

              {/* Detail */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Rekam Medis</span>

                  <span className="font-medium text-slate-900">
                    {patient.medical_record_number || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Kelamin</span>

                  <span className="text-slate-700">
                    {patient.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Lahir</span>

                  <span className="text-slate-700">
                    {formatDate(patient.birth_date)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Telepon</span>

                  <span className="text-slate-700">{patient.phone || "-"}</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500">Alamat</span>

                  <span className="max-w-[170px] text-right text-slate-700">
                    {patient.address?.length > 30
                      ? patient.address.slice(0, 30) + "..."
                      : patient.address || "-"}
                  </span>
                </div>
              </div>

              {/* Action */}
              {isAdmin && (
                <div className="mt-6 flex gap-2">
                  <Link
                    to={`${roleBase}/patients/${patient.id}`}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                  >
                    <Eye size={16} />
                  </Link>

                  <Link
                    to={`${roleBase}/patients/${patient.id}/edit`}
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="inline-flex items-center justify-center rounded-xl bg-rose-500 p-2.5 text-white transition hover:opacity-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={filteredPatients.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
