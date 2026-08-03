import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ title, subtitle, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Backdrop */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          sidebarOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />

        <button
          onClick={() => setSidebarOpen(false)}
          className="
            absolute
            right-4
            top-4
            rounded-xl
            bg-white
            p-2
            shadow-lg
            transition-all
            duration-300
            hover:rotate-90
            hover:bg-red-500
            hover:text-white
            active:scale-95
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* Desktop */}
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <Navbar
            title={title}
            subtitle={subtitle}
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
