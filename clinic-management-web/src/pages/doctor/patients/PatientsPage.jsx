import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";

import { getBookings } from "../../../services/bookingService";

import { toast } from "../../../utils/toast";
import useRoleBase from "../../../hooks/useRoleBase";
import useAuth from "../../../hooks/useAuth";

export default function PatientsPage() {
  const roleBase = useRoleBase();
  const { user } = useAuth();
  const doctorId = user?.doctor_id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const loadBookings = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getBookings({
        doctor_id: doctorId,
        per_page: 100,
      });
      setBookings(result.data);
    } catch (error) {
      toast.error("Gagal memuat data pasien");
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  // Pasien unik yang pernah booking ke dokter ini
  const patients = useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      if (booking.patient_id && !map.has(booking.patient_id)) {
        map.set(booking.patient_id, {
          id: booking.patient_id,
          name: booking.patient_name,
        });
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  const filteredPatients = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    if (!search) return patients;

    return patients.filter((patient) =>
      patient.name.toLowerCase().includes(search),
    );
  }, [patients, keyword]);

  return (
    <DashboardLayout
      title="Daftar Pasien"
      subtitle="Pasien yang pernah melakukan booking kepada Anda"
    >
      <div className="mb-5 w-full md:w-72">
        <Input
          placeholder="Cari pasien..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          icon={Search}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Memuat data pasien...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="rounded-2xl bg-white p-5 text-sm text-slate-500">
            Belum ada pasien yang booking kepada Anda.
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <Card
              key={patient.id}
              className="p-5 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {patient.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    Pasien dengan riwayat booking
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <Link
                  to={`${roleBase}/patients/${patient.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90"
                >
                  <Eye size={16} />
                  Lihat Detail
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
