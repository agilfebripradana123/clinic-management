import { useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, ArrowLeft, Send } from "lucide-react";
import Swal from "sweetalert2";

import AuthLayout from "../../components/layout/AuthLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import colors from "../../styles/colors";
import api from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setError("");

    try {
      setLoading(true);

      await api.post("/forgot-password", { email });

      await Swal.fire({
        icon: "success",
        title: "Permintaan Terkirim",
        text: "Admin telah diberi tahu. Hubungi admin untuk menerima password baru.",
        confirmButtonColor: "#06b6d4",
      });

      setEmail("");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const message = err.response?.data?.message;

      if (serverErrors?.email) {
        setError(
          Array.isArray(serverErrors.email) ? serverErrors.email[0] : serverErrors.email,
        );
        return;
      }

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: message || "Terjadi kesalahan. Coba lagi.",
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
            <KeyRound size={28} />
          </div>

          <h2
            className="text-2xl font-black md:text-3xl"
            style={{ color: colors.text }}
          >
            Lupa Password
          </h2>

          <p className="mt-2 text-sm" style={{ color: colors.textSecondary }}>
            Masukkan email. Admin akan mereset password Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="nama@mail.com"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />

            {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
          </div>

          <Button type="submit" loading={loading} icon={Send}>
            Kirim Permintaan Reset
          </Button>
        </form>

        <div className="mt-6">
          <Link to="/login">
            <Button type="button" variant="secondary" icon={ArrowLeft}>
              Kembali ke Login
            </Button>
          </Link>
        </div>
      </Card>
    </AuthLayout>
  );
}
