import { useCallback, useEffect, useState } from "react";
import { Eye, Pencil, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Badge from "../../../components/ui/Badge";
import PaginationControls from "../../../components/ui/PaginationControls";

import { getMedicalRecords } from "../../../services/medicalRecordService";

import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

export default function MedicalRecordsPage() {
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadRecords = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getMedicalRecords({
        doctor_id: doctorId,
        page: currentPage,
        per_page: pageSize,
        search: keyword,
      });

      setRecords(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data rekam medis");
    } finally {
      setLoading(false);
    }
  }, [doctorId, currentPage, pageSize, keyword]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, pageSize]);

  return (
    <DashboardLayout
      title="Rekam Medis"
      subtitle="Rekam medis pasien yang Anda tangani"
    >
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:w-72">
          <Input
            placeholder="Cari pasien, kode booking, atau diagnosa..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            icon={Search}
          />
        </div>

        <Link
          to={`${roleBase}/medical-records/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
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
        ) : records.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada rekam medis untuk Anda.
          </div>
        ) : (
          records.map((record) => (
            <Card
              key={record.id}
              className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {record.patient_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {record.booking_code}
                  </p>
                </div>

                <Badge color="success">Selesai</Badge>
              </div>

              <div className="mt-5 space-y-2 text-sm">
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

              {/* Action: hanya detail & edit, tanpa hapus */}
              <div className="mt-5 flex gap-2">
                <Link
                  to={`${roleBase}/medical-records/${record.id}`}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 p-2.5 text-white hover:opacity-90"
                  title="Detail"
                >
                  <Eye size={16} />
                </Link>

                <Link
                  to={`${roleBase}/medical-records/${record.id}/edit`}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 p-2.5 text-white hover:opacity-90"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
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
        totalItems={total}
        totalPages={Math.max(1, Math.ceil(total / pageSize))}
      />
    </DashboardLayout>
  );
}
