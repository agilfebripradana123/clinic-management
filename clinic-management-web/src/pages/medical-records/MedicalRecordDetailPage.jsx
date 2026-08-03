import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";

import { getMedicalRecord } from "../../services/medicalRecordService";
import { toast } from "../../utils/toast";
import useRoleBase from "../../hooks/useRoleBase";
import useAuth from "../../hooks/useAuth";

export default function MedicalRecordDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const canEdit = role === "admin" || role === "doctor";

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecord() {
      try {
        const data = await getMedicalRecord(id);
        setRecord(data);
      } catch (error) {
        toast.error("Gagal mengambil data rekam medis.");
      } finally {
        setLoading(false);
      }
    }

    loadRecord();
  }, [id]);

  return (
    <DashboardLayout
      title="Detail Rekam Medis"
      subtitle="Informasi lengkap rekam medis pasien"
    >
      <div className="mx-auto max-w-4xl space-y-4">
        <Card className="p-6 md:p-8">
          {loading ? (
            <p className="text-sm text-slate-500">
              Memuat detail rekam medis...
            </p>
          ) : record ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {record.patient_name}
                  </h2>

                  <p className="text-sm text-slate-500">
                    {record.booking_code}
                  </p>
                </div>

                <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                  Rekam Medis
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Kode Booking
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.booking_code}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nama Pasien
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.patient_name}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Dokter
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.doctor_name}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tanggal Booking
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.booking_date}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Keluhan
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.complaint}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Diagnosa
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.diagnosis}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tindakan
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.treatment}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Resep
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {record.prescription || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Catatan Tambahan
                  </p>

                  <p className="mt-1 whitespace-pre-line text-sm text-slate-900">
                    {record.notes || "-"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => navigate(`${roleBase}/medical-records/${id}/edit`)}
                    className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                  >
                    Edit Rekam Medis
                  </button>
                )}

                <Link
                  to={`${roleBase}/medical-records`}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  Kembali
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-rose-600">
              Rekam medis tidak ditemukan.
            </p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
