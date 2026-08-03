import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import { getDoctor } from "../../../services/doctorService";
import useRoleBase from "../../../hooks/useRoleBase";

export default function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctor() {
      try {
        const data = await getDoctor(id);
        setDoctor(data);
      } finally {
        setLoading(false);
      }
    }

    loadDoctor();
  }, [id]);

  return (
    <DashboardLayout title="Detail Dokter" subtitle="Informasi lengkap dokter">
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="p-6 md:p-8">
          {loading ? (
            <p className="text-sm text-slate-500">Memuat detail dokter...</p>
          ) : doctor ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {doctor.name || "Dokter"}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {doctor.email || "-"}
                  </p>
                </div>
              </div>

              {/* Detail */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nomor SIP
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {doctor.license_number || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Spesialis
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {doctor.specialty || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {doctor.email || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nomor Telepon
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {doctor.phone || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Alamat
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {doctor.address || "-"}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`${roleBase}/doctors/${id}/edit`)}
                  className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                >
                  Edit Dokter
                </button>

                <Link
                  to={`${roleBase}/doctors`}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  Kembali
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-rose-600">Dokter tidak ditemukan.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
