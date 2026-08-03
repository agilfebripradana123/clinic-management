import {
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import colors from "../../styles/colors";

// Fitur utama — sesuai layanan dalam sistem.
const features = [
  { icon: Stethoscope, label: "Dokter Spesialis" },
  { icon: CalendarCheck, label: "Booking Online" },
  { icon: ClipboardList, label: "Rekam Medis Digital" },
  { icon: HeartPulse, label: "Layanan Terpercaya" },
];

export default function AuthLayout({ children }) {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background dekoratif */}
      <div
        className="absolute -left-40 -top-40 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.primary}25` }}
      />

      <div
        className="absolute -right-40 bottom-0 h-96 w-96 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.secondary}25` }}
      />

      <div
        className="absolute left-1/3 top-10 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${colors.accent}15` }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2">
        {/* Kiri — promo */}
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
            className="mt-8 text-5xl font-black leading-tight xl:text-6xl"
            style={{ color: colors.text }}
          >
            Selamat Datang
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              }}
            >
              di Klinik Kami
            </span>
          </h1>

          {/* Fitur utama */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="group flex items-center gap-3 rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{
                  backgroundColor: colors.card,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${colors.primary}15` }}
                >
                  <Icon size={20} style={{ color: colors.primary }} />
                </div>

                <span className="text-sm font-semibold" style={{ color: colors.text }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kanan — form */}
        <div className="w-full max-w-lg justify-self-center">{children}</div>
      </div>
    </div>
  );
}
