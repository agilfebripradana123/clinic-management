import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";

import {
  deleteMedicalRecord,
  getMedicalRecords,
} from "../../../services/medicalRecordService";

import { toast } from "../../../utils/toast";
import { confirmDelete } from "../../../utils/confirm";
import useRoleBase from "../../../hooks/useRoleBase";

export default function MedicalRecordsPage() {
  const roleBase = useRoleBase();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("created_at-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadRecords = useCallback(async () => {
    setLoading(true);

    try {
      const [sortField, sortDir] = sortBy.split("-");
      const result = await getMedicalRecords({
        page: currentPage,
        per_page: pageSize,
        search: keyword,
        sort_by: sortField,
        sort_dir: sortDir,
      });

      setRecords(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data rekam medis");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword, sortBy]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, sortBy, pageSize]);

  const handleDelete = async (id) => {
    if (!(await confirmDelete("rekam medis"))) return;

    try {
      await deleteMedicalRecord(id);

      setRecords((current) => current.filter((record) => record.id !== id));
      setTotal((current) => Math.max(0, current - 1));

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
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <div className="w-full md:w-72">
            <Input
              placeholder="Cari pasien, kode booking, atau diagnosa..."
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
            <option value="booking_date-desc">Tanggal Terbaru</option>
            <option value="booking_date-asc">Tanggal Terlama</option>
          </Input>
        </div>

        <Link
          to={`${roleBase}/medical-records/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
        >
          <Plus size={16} />
          Tambah Rekam Medis
        </Link>
      </div>

      {/* Tabel */}
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Kode Booking
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Pasien
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Dokter
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Diagnosa
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
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Memuat data rekam medis...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Tidak ada data rekam medis yang cocok.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {record.booking_code || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.patient_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.doctor_name || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {record.booking_date || "-"}
                    </td>
                    <td className="max-w-[200px] px-6 py-4 text-slate-600">
                      <p className="truncate">{record.diagnosis || "-"}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge color="success">Selesai</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`${roleBase}/medical-records/${record.id}`}
                          className="rounded-xl bg-slate-900 p-2.5 text-white transition hover:opacity-90"
                          title="Detail"
                        >
                          <Eye size={16} />
                        </Link>

                        <Link
                          to={`${roleBase}/medical-records/${record.id}/edit`}
                          className="rounded-xl bg-emerald-500 p-2.5 text-white transition hover:opacity-90"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(record.id)}
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
