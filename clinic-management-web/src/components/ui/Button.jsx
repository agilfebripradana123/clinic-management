export default function Button({
  children,
  type = "button",
  loading = false,
  icon: Icon,
  variant = "primary",
  fullWidth = true,
  className = "",
  ...props
}) {
  const variants = {
    primary: "border-cyan-500 bg-cyan-500 text-white hover:bg-cyan-600",

    success:
      "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600",

    danger: "border-rose-500 bg-rose-500 text-white hover:bg-rose-600",

    warning: "border-amber-500 bg-amber-500 text-white hover:bg-amber-600",

    secondary: "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`
        inline-flex
        h-11
        ${fullWidth ? "w-full" : ""}
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        px-5
        text-sm
        font-semibold
        shadow-sm
        transition
        hover:-translate-y-0.5
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              className="opacity-25"
            />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </button>
  );
}
