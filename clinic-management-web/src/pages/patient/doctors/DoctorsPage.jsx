import { useCallback, useEffect, useState } from "react";
import { Stethoscope, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import PaginationControls from "../../../components/ui/PaginationControls";

import { getDoctors } from "../../../services/doctorService";

import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";

export default function DoctorsPage() {
  const roleBase = useRoleBase();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const loadDoctors = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getDoctors({
        page: currentPage,
        per_page: pageSize,
        search: keyword,
      });

      setDoctors(result.data);
      setTotal(result.total);
    } catch (error) {
      toast.error("Gagal memuat data dokter");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, keyword]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);

  useEffect(() => {
    setCurrentPage(1);
  }, [keyword, pageSize]);

  return (
    <DashboardLayout
      title="Dokter Tersedia"
      subtitle="Daftar dokter yang melayani di klinik"
    >
      <div className="mb-5 w-full md:w-72">
        <Input
          placeholder="Cari dokter..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          icon={Search}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data dokter...
          </div>
        ) : doctors.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Tidak ada dokter yang cocok.
          </div>
        ) : (
          doctors.map((doctor) => (
            <Card
              key={doctor.id}
              className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
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
              </div>

              <div className="mt-5">
                <Link
                  to={`${roleBase}/bookings/new?doctor=${doctor.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  <Stethoscope size={16} />
                  Buat Booking
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
