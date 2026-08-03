import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PaginationControls from "../../components/ui/PaginationControls";

import { deleteDoctor, getDoctors } from "../../services/doctorService";

import { toast } from "../../utils/toast";
import { confirmDelete } from "../../utils/confirm";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadDoctors() {
    try {
      const data = await getDoctors();
      setDoctors(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = doctors.filter((doctor) => {
      if (!search) return true;

      return [
        doctor.name,
        doctor.email,
        doctor.specialty,
        doctor.phone,
        doctor.address,
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
  }, [doctors, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredDoctors.length / pageSize));
  const paginatedDoctors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDoctors.slice(start, start + pageSize);
  }, [filteredDoctors, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("dokter"))) return;

    try {
      await deleteDoctor(id);

      setDoctors((current) => current.filter((doctor) => doctor.id !== id));

      toast.success("Dokter berhasil dihapus");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus dokter");
    }
  };

  return (
    <DashboardLayout
      title="Kelola Dokter"
      subtitle="Daftar dokter yang terdaftar di klinik"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari dokter..."
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
            <option value="specialty-asc">Spesialis A-Z</option>
            <option value="specialty-desc">Spesialis Z-A</option>
          </Input>
        </div>

        <Link
          to="/doctors/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Dokter
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data dokter...
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada data dokter yang cocok.
          </div>
        ) : (
          paginatedDoctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {doctor.email || "-"}
                  </p>
                </div>

                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
                  {doctor.specialty || "-"}
                </span>
              </div>

              {/* Detail */}
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. SIP</span>

                  <span className="font-medium text-slate-900">
                    {doctor.license_number || "-"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Telepon</span>

                  <span className="text-slate-700">{doctor.phone || "-"}</span>
                </div>

                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-500">Alamat</span>

                  <span className="max-w-[180px] break-words text-right text-slate-700">
                    {doctor.address?.length > 30
                      ? doctor.address.slice(0, 30) + "..."
                      : doctor.address || "-"}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-6 flex gap-2">
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                  title="Detail"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`/doctors/${doctor.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(doctor.id)}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500 p-2.5 text-white transition hover:opacity-90"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <PaginationControls
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalItems={filteredDoctors.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
