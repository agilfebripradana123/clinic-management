import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Dashboard Dokter"
      subtitle="Selamat datang di Sistem Klinik Management"
    >
      <Card className="bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 p-8 text-white">
        <h1 className="text-3xl font-black">
          Selamat Datang, Dokter
          <span className="ml-2">{user?.name ?? "Dokter"} 👋</span>
        </h1>

        <p className="mt-3 max-w-2xl text-cyan-100">
          Dashboard dokter. Konten akan diisi pada tahap berikutnya.
        </p>
      </Card>
    </DashboardLayout>
  );
}
