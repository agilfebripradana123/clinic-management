import { useEffect, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import PaginationControls from "../../../components/ui/PaginationControls";
import { toast } from "../../../utils/toast";
import api from "../../../services/api";
import { extractPageMeta } from "../../../services/api";

export default function ReportsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadRecords = async () => {
    setLoading(true);

    try {
      const response = await api.get("/medical-records", {
        params: { page: currentPage, per_page: pageSize },
      });

      const { list, total: recordTotal } = extractPageMeta(response.data);
      setRecords(list);
      setTotal(recordTotal);
    } catch (error) {
      toast.error("Gagal memuat rekam medis");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [currentPage, pageSize]);

  const handleExport = async () => {
    setExporting(true);

    try {
      const response = await api.get("/medical-records/export", {
        responseType: "blob",
      });

      const disposition = response.headers["content-disposition"] || "";
      const match = disposition.match(/filename="?([^";]+)"?/);
      const filename = match?.[1] || "rekam-medis.csv";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Rekam medis berhasil diunduh");
    } catch (error) {
      toast.error("Gagal mengunduh rekam medis");
    } finally {
      setExporting(false);
    }
  };

  return (
    <DashboardLayout
      title="Laporan"
      subtitle="Arsip rekam medis pasien"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          {total} data rekam medis tercatat.
        </p>

        <button
          onClick={handleExport}
          disabled={exporting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {exporting ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
              </svg>
              Mengunduh...
            </>
          ) : (
            <>
              <FileSpreadsheet size={16} />
              <Download size={16} />
              Download Excel
            </>
          )}
        </button>
      </div>

      {/* Tabel rekam medis */}
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
                  Diagnosa
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Pengobatan
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Resep
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Tanggal
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Memuat rekam medis...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    Belum ada data rekam medis.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      {record.booking?.booking_code || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.booking?.patient?.user?.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.booking?.doctor?.user?.name || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.diagnosis || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.treatment || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.prescription || "-"}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleDateString("id-ID")
                        : "-"}
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
