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
    gender: "P",
    birth_date: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await register(form);
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
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="contoh@mail.com"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
          />

          <Input
            label="Jenis Kelamin"
            type="select"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </Input>

          <Input
            label="Tanggal Lahir"
            type="date"
            name="birth_date"
            value={form.birth_date}
            onChange={handleChange}
          />

          <Input
            label="Nomor Telepon"
            name="phone"
            placeholder="081234567890"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="md:col-span-2">
            <Input
              label="Alamat"
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
