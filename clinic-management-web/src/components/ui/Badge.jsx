const Badge = ({ children, color = "success" }) => {
  const colors = {
    success: "bg-green-100 text-green-700",

    danger: "bg-red-100 text-red-700",

    warning: "bg-yellow-100 text-yellow-700",

    info: "bg-cyan-100 text-cyan-700",

    purple: "bg-violet-100 text-violet-700",

    gray: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-3
        py-1
        text-xs
        font-semibold
        ${colors[color]}
      `}
    >
      {children}
    </span>
  );
};

export default Badge;
