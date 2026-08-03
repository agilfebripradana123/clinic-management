export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        duration-200
        ease-out
        hover:border-slate-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
