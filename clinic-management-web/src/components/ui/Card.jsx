export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl
        border-2
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-cyan-400
        hover:shadow-xl
        ${className}
      `}
    >
      {children}
    </div>
  );
}
