import { Activity, ShieldCheck } from "lucide-react";
import colors from "../../styles/colors";

export default function AuthLayout({ children }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background */}
      <div
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}25` }}
      />

      <div
        className="absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.secondary}25` }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Left */}
        <div className="hidden lg:block">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            style={{
              backgroundColor: `${colors.primary}15`,
              color: colors.primary,
            }}
          >
            <ShieldCheck size={18} />
            Clinic Management System
          </span>

          <h1
            className="mt-8 text-6xl font-black leading-tight"
            style={{ color: colors.text }}
          >
            Manage Your
            <br />
            <span style={{ color: colors.primary }}>Clinic Smarter.</span>
          </h1>

          <p
            className="mt-6 max-w-lg text-lg leading-8"
            style={{ color: colors.textSecondary }}
          >
            Kelola pasien, dokter, jadwal, dan rekam medis dalam satu dashboard
            modern yang cepat, aman, dan mudah digunakan.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-5">
            <InfoCard title="Patients" value="320+" />
            <InfoCard title="Doctors" value="28+" />
            <InfoCard title="Bookings" value="48 Today" />
            <InfoCard title="Medical Records" value="100% Digital" />
          </div>
        </div>

        {/* Right */}
        <div className="w-full max-w-lg justify-self-center">{children}</div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
      }}
    >
      <Activity className="mb-3" size={22} style={{ color: colors.primary }} />

      <h3 className="font-semibold" style={{ color: colors.text }}>
        {title}
      </h3>

      <p className="mt-1 text-sm" style={{ color: colors.textSecondary }}>
        {value}
      </p>
    </div>
  );
}
