import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity } from "lucide-react";
import Swal from "sweetalert2";

import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { register } from "../../services/authService";
import { toast } from "../../utils/toast";
import colors from "../../styles/colors";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    birth_date: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validasi client-side
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Nama wajib diisi.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Format email tidak valid.";
    }

    if (!form.password) {
      nextErrors.password = "Password wajib diisi.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password minimal 8 karakter.";
    }

    if (!form.gender) {
      nextErrors.gender = "Jenis kelamin wajib dipilih.";
    }

    if (!form.birth_date) {
      nextErrors.birth_date = "Tanggal lahir wajib diisi.";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Nomor telepon wajib diisi.";
    } else if (!/^[0-9+()-]{8,20}$/.test(form.phone.trim())) {
      nextErrors.phone = "Nomor telepon tidak valid.";
    }

    if (!form.address.trim()) {
      nextErrors.address = "Alamat wajib diisi.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        gender: form.gender,
        birth_date: form.birth_date,
        phone: form.phone,
        address: form.address,
      };

      const response = await register(payload);
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil",
        text: "Akun pasien Anda telah dibuat. Selamat datang di Clinic Management System.",
        confirmButtonColor: "#06b6d4",
      });

      navigate("/patient/dashboard");
    } catch (error) {
      // Tampilkan error validasi dari server per-field (Laravel 422)
      const serverErrors = error.response?.data?.errors;

      if (serverErrors) {
        const nextServerErrors = {};
        Object.entries(serverErrors).forEach(([field, messages]) => {
          nextServerErrors[field] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });
        setErrors(nextServerErrors);

        toast.error(error.response?.data?.message || "Periksa kembali isian Anda.");
        return;
      }

      await Swal.fire({
        icon: "error",
        title: "Registrasi Gagal",
        text:
          error.response?.data?.message ||
          "Registrasi gagal. Silakan coba lagi.",
        confirmButtonColor: "#06b6d4",
      });
    } finally {
      setLoading(false);
    }
  };

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

      <Card className="relative w-full max-w-2xl p-5 md:p-6">
        <div className="mb-6">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg"
            style={{
              backgroundColor: colors.primary,
              color: "#fff",
            }}
          >
            <Activity size={28} />
          </div>

          <h2
            className="text-2xl font-black md:text-3xl"
            style={{ color: colors.text }}
          >
            Buat Akun Baru
          </h2>

          <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
            Registrasi untuk pasien dan akses booking pemeriksaan.
          </p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="md:col-span-2">
            <Input
              label="Nama Lengkap"
              name="name"
              placeholder="Masukkan nama lengkap"
              value={form.name}
              onChange={handleChange}
            />

            {errors.name && (
              <p className="mt-1 text-sm text-rose-600">{errors.name}</p>
            )}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="contoh@mail.com"
              value={form.email}
              onChange={handleChange}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-rose-600">{errors.email}</p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={handleChange}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-rose-600">{errors.password}</p>
            )}
          </div>

          <div>
            <Input
              label="Jenis Kelamin"
              type="select"
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">Pilih</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </Input>

            {errors.gender && (
              <p className="mt-1 text-sm text-rose-600">{errors.gender}</p>
            )}
          </div>

          <div>
            <Input
              label="Tanggal Lahir"
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
            />

            {errors.birth_date && (
              <p className="mt-1 text-sm text-rose-600">{errors.birth_date}</p>
            )}
          </div>

          <div>
            <Input
              label="Nomor Telepon"
              name="phone"
              placeholder="081234567890"
              value={form.phone}
              onChange={handleChange}
            />

            {errors.phone && (
              <p className="mt-1 text-sm text-rose-600">{errors.phone}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <Input
              label="Alamat"
              name="address"
              placeholder="Masukkan alamat lengkap"
              value={form.address}
              onChange={handleChange}
            />

            {errors.address && (
              <p className="mt-1 text-sm text-rose-600">{errors.address}</p>
            )}
          </div>

          <div className="md:col-span-2 mt-1">
            <Button type="submit" loading={loading}>
              Daftar Sekarang
            </Button>
          </div>
        </form>

        <div
          className="mt-5 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </div>

        <div
          className="mt-8 border-t pt-6 text-center text-sm"
          style={{
            borderColor: colors.border,
            color: colors.textSecondary,
          }}
        >
          © 2026 Clinic Management System
        </div>
      </Card>
    </div>
  );
}
