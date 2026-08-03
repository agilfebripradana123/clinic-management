import { Link } from "react-router-dom";

import AuthLayout from "../../components/layout/AuthLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card>
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Lupa Password</h2>
          <p className="mt-2 text-sm text-slate-500">
            Masukkan email Anda untuk menerima link reset password.
          </p>
        </div>

        <form className="space-y-4">
          <Input label="Email" type="email" placeholder="admin@clinic.com" />
          <Button>Kirim Link Reset</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Kembali ke{" "}
          <Link to="/login" className="font-semibold text-cyan-600">
            Login
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
