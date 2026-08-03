import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import { getPatient } from "../../../services/patientService";
import { formatDate } from "../../../utils/format";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

export default function PatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatient() {
      try {
        const data = await getPatient(id);
        setPatient(data);
      } finally {
        setLoading(false);
      }
    }

    loadPatient();
  }, [id]);

  return (
    <DashboardLayout title="Detail Pasien" subtitle="Riwayat dan data pasien">
      <div className="mx-auto max-w-3xl space-y-4">
        <Card className="p-6 md:p-8">
          {loading ? (
            <p className="text-sm text-slate-500">Memuat detail pasien...</p>
          ) : patient ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {patient.name}
                  </h2>

                  <p className="text-sm text-slate-500">{patient.email}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    patient.is_active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {patient.is_active ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </p>

                  <p className="mt-1 text-sm text-slate-900">{patient.email}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nomor Rekam Medis
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {patient.medical_record_number}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Jenis Kelamin
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {patient.gender === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Tanggal Lahir
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {formatDate(patient.birth_date)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nomor Telepon
                  </p>

                  <p className="mt-1 text-sm text-slate-900">{patient.phone}</p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Alamat
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {patient.address}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => navigate(`${roleBase}/patients/${id}/edit`)}
                    className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600"
                  >
                    Edit Pasien
                  </button>
                )}
                <Link
                  to={`${roleBase}/patients`}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  Kembali
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-sm text-rose-600">Pasien tidak ditemukan.</p>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
