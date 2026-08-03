import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Input({
  label,
  icon: Icon,
  type = "text",
  className = "",
  children,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isSelect = type === "select";

  const sharedClassName = `
    h-12
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    ${Icon ? "pl-11" : "pl-4"}
    ${isSelect ? "pr-4" : "pr-12"}
    text-sm
    outline-none
    transition-all
    duration-300
    focus:border-cyan-500
    focus:ring-4
    focus:ring-cyan-100
    disabled:bg-slate-100
    disabled:text-slate-500
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}

        {isSelect ? (
          <select className={sharedClassName} {...props}>
            {children}
          </select>
        ) : (
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={sharedClassName}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
