import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Camera,
  Mail,
  Pencil,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

import DashboardLayout from "../../components/layout/DashboardLayout";
import Card from "../../components/ui/Card";
import useAuth from "../../hooks/useAuth";
import {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
} from "../../services/profileService";
import { formatDate } from "../../utils/format";
import { toast } from "../../utils/toast";

const roleLabels = {
  admin: "Administrator",
  doctor: "Dokter",
  patient: "Pasien",
};

const resolvePhotoUrl = (photo) => {
  if (!photo) {
    return "";
  }

  if (/^https?:\/\//.test(photo)) {
    return photo;
  }

  const baseUrl = (import.meta.env.VITE_API_URL || "")
    .replace(/\/api\/?$/, "")
    .replace(/\/$/, "");

  return `${baseUrl}${photo}`;
};

export default function ProfilePage() {
  const fileInputRef = useRef(null);
  const { user, syncUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    specialist: "",
    license_number: "",
    medical_record_number: "",
    gender: "",
    birth_date: "",
  });

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");
      const data = await getProfile();
      setProfile(data);
      syncUser({ ...user, ...data });
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        specialist: data.specialist || "",
        license_number: data.license_number || "",
        medical_record_number: data.medical_record_number || "",
        gender: data.gender || "",
        birth_date: data.birth_date || "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal memuat profil. Silakan coba lagi.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  const avatarUrl = resolvePhotoUrl(profile?.photo);
  const displayName = profile?.name || "Pengguna";
  const roleText = roleLabels[profile?.role] || "Pengguna";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleDetails =
    profile?.role === "doctor"
      ? [
          {
            label: "Spesialis",
            value: profile?.specialist || "-",
          },
          {
            label: "Nomor Lisensi",
            value: profile?.license_number || "-",
          },
        ]
      : profile?.role === "patient"
        ? [
            {
              label: "Nomor Rekam Medis",
              value: profile?.medical_record_number || "-",
            },
            {
              label: "Jenis Kelamin",
              value:
                profile?.gender === "L"
                  ? "Laki-laki"
                  : profile?.gender === "P"
                    ? "Perempuan"
                    : "-",
            },
            {
              label: "Tanggal Lahir",
              value: profile?.birth_date ? formatDate(profile.birth_date) : "-",
            },
          ]
        : [
            {
              label: "Akses",
              value: "Akun administrator penuh",
            },
          ];

  const aboutAccountText =
    {
      admin:
        "Akun ini digunakan untuk mengelola seluruh aktivitas administratif pada sistem Klinik Management, termasuk pengelolaan data dokter, pasien, jadwal praktik, booking, rekam medis, dan laporan statistik klinik.",
      doctor:
        "Akun ini digunakan untuk mengelola jadwal praktik, melihat data pasien, menyiapkan rekam medis, serta memantau booking pemeriksaan yang terkait dengan dokter terdaftar.",
      patient:
        "Akun ini digunakan untuk melihat jadwal dokter, mengelola booking pemeriksaan, serta memantau riwayat kunjungan dan rekam medis yang terkait dengan pasien.",
    }[profile?.role] ||
    "Akun ini digunakan untuk mengakses berbagai fitur pada sistem Klinik Management sesuai kebutuhan pengguna.";

  const handleOpenModal = () => {
    setForm({
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      specialist: profile?.specialist || "",
      license_number: profile?.license_number || "",
      medical_record_number: profile?.medical_record_number || "",
      gender: profile?.gender || "",
      birth_date: profile?.birth_date || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      syncUser({ ...user, ...updated });
      setShowModal(false);
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal memperbarui profil");
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const result = await Swal.fire({
      title: "Upload Foto Profil?",
      text: "Foto ini akan digunakan sebagai avatar profil Anda.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Upload",
      cancelButtonText: "Batal",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) {
      event.target.value = "";
      return;
    }

    try {
      const updated = await uploadProfilePhoto(file);
      setProfile(updated);
      syncUser({ ...user, ...updated });
      toast.success("Foto profil berhasil diperbarui");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal mengunggah foto profil",
      );
    } finally {
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Profil" subtitle="Memuat data profil...">
        <Card className="p-8 text-sm text-slate-500">Memuat profil...</Card>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Profil" subtitle="Terjadi kesalahan">
        <Card className="p-8 text-sm text-rose-600">{error}</Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Profil"
      subtitle="Informasi profil pengguna dan akun"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-8 text-center">
          <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full bg-cyan-100 ring-4 ring-cyan-50">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-cyan-100 text-2xl font-bold text-cyan-700">
                {initials || <User size={32} />}
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 rounded-full bg-slate-900 p-2 text-white shadow-lg"
              title="Upload foto"
              aria-label="Upload foto"
            >
              <Camera size={16} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-800">
            {displayName}
          </h2>

          <p className="mt-1 text-slate-500">{roleText}</p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-1 text-sm font-semibold text-emerald-600">
              ● Akun Aktif
            </span>

            <button
              type="button"
              onClick={handleOpenModal}
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-sm font-semibold text-white"
            >
              <Pencil size={14} />
              Edit Profil
            </button>
          </div>
        </Card>

        <Card className="p-8 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-800">Informasi Akun</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <div className="rounded-lg bg-cyan-100 p-3">
                <User className="text-cyan-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Nama Lengkap</p>
                <h3 className="font-semibold text-slate-800">{displayName}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <Mail className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <h3 className="font-semibold text-slate-800">
                  {profile.email}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <div className="rounded-lg bg-green-100 p-3">
                <Phone className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Nomor Telepon</p>
                <h3 className="font-semibold text-slate-800">
                  {profile.phone || "-"}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <div className="rounded-lg bg-violet-100 p-3">
                <ShieldCheck className="text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Role</p>
                <h3 className="font-semibold text-slate-800">{roleText}</h3>
              </div>
            </div>

            {roleDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-slate-200 p-4"
              >
                <div className="rounded-lg bg-amber-100 p-3">
                  <ShieldCheck className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <h3 className="font-semibold text-slate-800">{item.value}</h3>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <CalendarDays className="text-cyan-600" />
            <h2 className="text-lg font-bold text-slate-800">Statistik Akun</h2>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-emerald-600">Aktif</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Role</span>
              <span className="font-semibold capitalize">{roleText}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bergabung</span>
              <span className="font-semibold">
                {formatDate(profile.created_at) || "-"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800">Tentang Akun</h2>
          <p className="mt-4 leading-7 text-slate-600">{aboutAccountText}</p>
        </Card>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-4 w-full max-w-2xl rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Edit Profil</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full bg-slate-100 p-2 text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Nama
                  </span>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Email
                  </span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        email: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Nomor Telepon
                  </span>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />
                </label>

                <label className="space-y-1">
                  <span className="text-sm font-semibold text-slate-700">
                    Role
                  </span>
                  <input
                    value={roleText}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                  />
                </label>

                {profile?.role === "doctor" ? (
                  <>
                    <label className="space-y-1">
                      <span className="text-sm font-semibold text-slate-700">
                        Spesialis
                      </span>
                      <input
                        value={form.specialist}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            specialist: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-sm font-semibold text-slate-700">
                        Nomor Lisensi
                      </span>
                      <input
                        value={form.license_number}
                        disabled
                        className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                      />
                    </label>
                  </>
                ) : null}

                {profile?.role === "patient" ? (
                  <>
                    <label className="space-y-1">
                      <span className="text-sm font-semibold text-slate-700">
                        Nomor Rekam Medis
                      </span>
                      <input
                        value={form.medical_record_number}
                        disabled
                        className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none"
                      />
                    </label>

                    <label className="space-y-1">
                      <span className="text-sm font-semibold text-slate-700">
                        Jenis Kelamin
                      </span>
                      <select
                        value={form.gender}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            gender: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      >
                        <option value="">Pilih</option>
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </label>

                    <label className="space-y-1 md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Tanggal Lahir
                      </span>
                      <input
                        type="date"
                        value={form.birth_date}
                        onChange={(e) =>
                          setForm((current) => ({
                            ...current,
                            birth_date: e.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                      />
                    </label>
                  </>
                ) : null}

                <label className="space-y-1 md:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">
                    Alamat
                  </span>
                  <textarea
                    rows="4"
                    value={form.address}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        address: e.target.value,
                      }))
                    }
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-cyan-500"
                  />
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
