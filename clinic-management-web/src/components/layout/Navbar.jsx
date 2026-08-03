import { useNavigate } from "react-router-dom";
import { Bell, Search, UserCircle2, LogOut, Menu } from "lucide-react";

import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";

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

export default function Navbar({
  title = "Dashboard",
  subtitle = "Welcome Back 👋",
  onMenuClick,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const avatarUrl = resolvePhotoUrl(user?.photo);
  const displayName = user?.name || "Administrator";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await logout();

      await Swal.fire({
        icon: "success",
        title: "Logout Berhasil",
        text: "Sampai jumpa kembali 👋",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Logout gagal.",
      });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="
                group
                rounded-xl
                border
                border-slate-200
                bg-white
                p-2.5
                shadow-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-cyan-500
                hover:bg-cyan-500
                hover:shadow-xl
                active:scale-90
                lg:hidden
              "
            >
              <Menu
                size={22}
                className="
                  text-slate-700
                  transition-all
                  duration-300
                  group-hover:rotate-180
                  group-hover:text-white
                "
              />
            </button>

            <div>
              <h1 className="text-lg font-bold text-slate-800 sm:text-2xl">
                {title}
              </h1>

              <p className="hidden text-sm text-slate-500 sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              className="
                relative
                rounded-xl
                p-2
                transition
                hover:bg-slate-100
              "
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button
              className="
                hidden
                rounded-xl
                p-2
                transition
                hover:bg-slate-100
                md:block
              "
            >
              <Search size={20} />
            </button>

            {/* Desktop User */}
            <div className="hidden items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 lg:flex">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-cyan-100 ring-2 ring-cyan-50">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-cyan-100 text-xs font-bold text-cyan-700">
                    {initials || <UserCircle2 size={20} />}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold">{displayName}</h3>

                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || "admin"}
                </p>
              </div>
            </div>

            {/* Mobile Avatar */}
            <button
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-cyan-100
                text-cyan-700
                lg:hidden
              "
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-cyan-100 text-xs font-bold text-cyan-700">
                  {initials || <UserCircle2 size={18} />}
                </div>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="
                rounded-xl
                border
                border-slate-200
                p-2
                text-slate-600
                transition-all
                hover:border-red-300
                hover:bg-red-50
                hover:text-red-500
                active:scale-90
              "
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Subtitle */}
        <div className="mt-2 sm:hidden">
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
    </header>
  );
}
