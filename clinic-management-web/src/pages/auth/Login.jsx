import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail } from "lucide-react";
import Swal from "sweetalert2";

import AuthLayout from "../../components/layout/AuthLayout";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

import useAuth from "../../hooks/useAuth";
import colors from "../../styles/colors";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@clinic.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      const role = response?.user?.role?.toLowerCase();
      const dashboardByRole = {
        admin: "/admin/dashboard",
        doctor: "/doctor/dashboard",
        patient: "/patient/dashboard",
      };

      await Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        text: "Selamat datang kembali di Clinic Management System.",
        confirmButtonColor: "#06b6d4",
      });

      navigate(dashboardByRole[role] || "/login");
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: err.response?.data?.message || "Login gagal. Coba kembali.",
        confirmButtonColor: "#06b6d4",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md p-5 md:p-6">
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
            Masuk ke Akun
          </h2>

          <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
            Login untuk mengakses dashboard Clinic Management System.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            icon={Mail}
            type="email"
            placeholder="admin@clinic.com"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <Input
            label="Password"
            icon={Lock}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          <Button type="submit" loading={loading} icon={ArrowRight}>
            Sign In
          </Button>
        </form>

        <div
          className="mt-5 text-center text-sm"
          style={{ color: colors.textSecondary }}
        >
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-cyan-600">
            Register
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
    </AuthLayout>
  );
}
