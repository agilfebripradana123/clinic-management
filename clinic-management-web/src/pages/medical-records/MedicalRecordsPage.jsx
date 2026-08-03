import { useEffect, useMemo, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import PaginationControls from "../../components/ui/PaginationControls";

import {
  deleteMedicalRecord,
  getMedicalRecords,
} from "../../services/medicalRecordService";

import { toast } from "../../utils/toast";
import { confirmDelete } from "../../utils/confirm";

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("booking_date-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  async function loadRecords() {
    try {
      const data = await getMedicalRecords();
      setRecords(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    const filtered = records.filter((record) => {
      if (!search) return true;

      return [
        record.patient_name,
        record.doctor_name,
        record.booking_code,
        record.diagnosis,
        record.prescription,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });

    const [field, order] = sortBy.split("-");

    return filtered.sort((a, b) => {
      if (field === "booking_date") {
        return order === "asc"
          ? new Date(a.booking_date) - new Date(b.booking_date)
          : new Date(b.booking_date) - new Date(a.booking_date);
      }

      const first = String(a[field] ?? "").toLowerCase();
      const second = String(b[field] ?? "").toLowerCase();

      if (first < second) return order === "asc" ? -1 : 1;
      if (first > second) return order === "asc" ? 1 : -1;
      return 0;
    });
  }, [records, keyword, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("rekam medis"))) return;

    try {
      await deleteMedicalRecord(id);

      setRecords((current) => current.filter((record) => record.id !== id));

      toast.success("Rekam medis berhasil dihapus");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Gagal menghapus rekam medis",
      );
    }
  };

  return (
    <DashboardLayout
      title="Kelola Rekam Medis"
      subtitle="Daftar rekam medis seluruh pasien"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari rekam medis..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              icon={Search}
            />
          </div>

          <Input
            type="select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-w-[200px]"
          >
            <option value="booking_date-desc">Tanggal Terbaru</option>
            <option value="booking_date-asc">Tanggal Terlama</option>
            <option value="patient_name-asc">Pasien A-Z</option>
            <option value="patient_name-desc">Pasien Z-A</option>
          </Input>
        </div>

        <Link
          to="/medical-records/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Rekam Medis
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data rekam medis...
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada data rekam medis yang cocok.
          </div>
        ) : (
          paginatedRecords.map((record) => (
            <Card key={record.id} className="p-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {record.patient_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {record.booking_code}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Selesai
                </span>
              </div>

              {/* Detail */}
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Dokter</span>

                  <span className="font-medium">{record.doctor_name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal</span>

                  <span>{record.booking_date || "-"}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Diagnosa</span>

                  <span className="text-right">{record.diagnosis}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Resep</span>

                  <span className="text-right">
                    {record.prescription || "-"}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="mt-5 flex gap-2">
                <Link
                  to={`/medical-records/${record.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`/medical-records/${record.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white hover:opacity-90"
                >
                  <Pencil size={16} />
                </Link>

                <button
                  onClick={() => handleDelete(record.id)}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500 p-2.5 text-white hover:opacity-90"
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
        totalItems={filteredRecords.length}
        totalPages={totalPages}
      />
    </DashboardLayout>
  );
}
