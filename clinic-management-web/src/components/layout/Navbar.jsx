import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  UserCircle2,
  LogOut,
  Menu,
  CheckCheck,
  CalendarCheck,
  ClipboardList,
  FileText,
  KeyRound,
  X,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import useNotifications from "../../hooks/useNotifications";
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

const typeIcons = {
  booking_new: CalendarCheck,
  booking_status: ClipboardList,
  medical_record_created: FileText,
  password_reset_request: KeyRound,
};

// Status booking → Bahasa Indonesia (frontend).
const statusId = {
  pending: "Menunggu",
  confirmed: "Dikonfirmasi",
  completed: "Selesai",
  cancelled: "Dibatalkan",
};

// Ganti kata status Inggris di pesan notif menjadi Indonesia.
const toIndonesian = (message = "") => {
  return message
    .replace(/\bpending\b/g, statusId.pending)
    .replace(/\bconfirmed\b/g, statusId.confirmed)
    .replace(/\bcompleted\b/g, statusId.completed)
    .replace(/\bcancelled\b/g, statusId.cancelled);
};

export default function Navbar({
  title = "Dashboard",
  subtitle = "Welcome Back",
  onMenuClick,
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    loading,
    fetchList,
    handleRead,
    handleReadAll,
    refreshUnread,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Tutup panel saat klik di luar
  useEffect(() => {
    function onClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const avatarUrl = resolvePhotoUrl(user?.photo);
  const displayName = user?.name || "Administrator";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const role = user?.role?.toLowerCase() || "admin";

  const roleLabels = {
    admin: "Administrator",
    doctor: "Dokter",
    patient: "Pasien",
  };

  // Arahkan notif ke halaman sesuai tipe & role yang login.
  const getNotificationPath = (notification) => {
    const { type, data } = notification;
    const bookingId = data?.booking_id;

    switch (type) {
      case "booking_new":
      case "booking_status":
        return bookingId
          ? `/${role}/bookings/${bookingId}`
          : `/${role}/bookings`;

      case "medical_record_created":
        return data?.medical_record_id
          ? `/${role}/medical-records/${data.medical_record_id}`
          : `/${role}/medical-records`;

      case "password_reset_request":
        // Admin: arahkan ke halaman user yang minta reset
        return data?.user_id
          ? `/admin/users/${data.user_id}`
          : "/admin/users";

      default:
        return `/${role}/dashboard`;
    }
  };

  const handleNotificationClick = (notification) => {
    const path = getNotificationPath(notification);

    handleRead(notification);
    setOpen(false);
    navigate(path);
  };

  const handleToggle = () => {
    if (open) refreshUnread();
    else fetchList();
    setOpen((prev) => !prev);
  };

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
        text: "Sampai jumpa kembali",
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

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-800 sm:text-2xl">
                {title}
              </h1>

              <p className="hidden truncate text-sm text-slate-500 sm:block">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifikasi */}
            <div className="relative" ref={panelRef}>
              <button
                onClick={handleToggle}
                className="
                  relative
                  rounded-xl
                  p-2
                  transition
                  hover:bg-slate-100
                "
                aria-label="Notifikasi"
              >
                <Bell size={20} />

                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {open && (
                <div className="fixed inset-x-4 top-16 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96">
                  {/* Header panel */}
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <h3 className="text-sm font-bold text-slate-800">
                      Notifikasi
                    </h3>

                    <div className="flex items-center gap-1">
                      {unreadCount > 0 && (
                        <button
                          onClick={handleReadAll}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-cyan-600 transition hover:bg-cyan-50"
                        >
                          <CheckCheck size={14} />
                          Tandai Semua
                        </button>
                      )}

                      <button
                        onClick={() => setOpen(false)}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Daftar notifikasi */}
                  <div className="max-h-96 overflow-y-auto">
                    {loading && notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-400">
                        Memuat notifikasi...
                      </p>
                    ) : notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-400">
                        Belum ada notifikasi.
                      </p>
                    ) : (
                      notifications.map((notification) => {
                        const Icon =
                          typeIcons[notification.type] || Bell;

                        return (
                          <button
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`
                              flex
                              w-full
                              items-start
                              gap-3
                              border-b
                              border-slate-50
                              px-4
                              py-3
                              text-left
                              transition
                              hover:bg-slate-50
                              ${notification.is_read ? "opacity-60" : ""}
                            `}
                          >
                            <div
                              className={`
                                mt-0.5
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                ${
                                  notification.is_read
                                    ? "bg-slate-100 text-slate-400"
                                    : "bg-cyan-50 text-cyan-600"
                                }
                              `}
                            >
                              <Icon size={18} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-slate-800">
                                {notification.title}
                              </p>

                              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                                {toIndonesian(notification.message)}
                              </p>

                              <p className="mt-1 text-[11px] text-slate-400">
                                {new Date(
                                  notification.created_at,
                                ).toLocaleString("id-ID")}
                              </p>
                            </div>

                            {!notification.is_read && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

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

                <p className="text-xs text-slate-500">
                  {roleLabels[role] || role}
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
