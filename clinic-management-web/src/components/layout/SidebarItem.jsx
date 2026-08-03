import { NavLink } from "react-router-dom";
import clsx from "clsx";

const SidebarItem = ({ to, icon: Icon, title }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
          isActive
            ? "bg-cyan-500 text-white shadow-md"
            : "text-slate-300 hover:bg-slate-800 hover:text-white",
        )
      }
    >
      <Icon size={20} />
      <span className="font-medium">{title}</span>
    </NavLink>
  );
};

export default SidebarItem;
