import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AuthLayout from "../../components/layout/AuthLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { register } from "../../services/authService";

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
        gender: form.gender || null,
        birth_date: form.birth_date || null,
        phone: form.phone || null,
        address: form.address || null,
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
    <AuthLayout>
      <Card className="w-full max-w-2xl p-5 md:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-slate-500">
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

          <Input
            label="Jenis Kelamin (opsional)"
            type="select"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="">Pilih</option>
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Input>

          <Input
            label="Tanggal Lahir (opsional)"
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />

          <Input
            label="Nomor Telepon (opsional)"
            name="phone"
            placeholder="081234567890"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Input
              label="Alamat (opsional)"
              name="address"
              placeholder="Masukkan alamat lengkap"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2 mt-1">
            <Button type="submit" loading={loading}>
              Daftar Sekarang
            </Button>
          </div>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
