// Bar chart HTML/CSS ringan — tanpa library chart.
// `data`: [{ label, total }]. Sequential (satu hue, lebih besar lebih pekat).
export default function BarChart({ data = [], height = 200, color = "#06b6d4" }) {
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.total), 1);
  const plotH = height - 46; // ruang untuk nilai (atas) + label (bawah)

  return (
    <div className="flex items-end gap-3 sm:gap-4" style={{ height }}>
      {data.map((d) => {
        const barH = d.total === 0 ? 2 : (d.total / max) * plotH;

        return (
          <div
            key={d.label}
            className="flex flex-1 flex-col items-center justify-end gap-2"
            style={{ height: `${height}px` }}
          >
            {/* Nilai */}
            <span className="text-sm font-bold text-slate-800">
              {d.total}
            </span>

            {/* Bar */}
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${barH}px`,
                backgroundColor: color,
                opacity: 0.4 + 0.6 * (d.total / max),
              }}
              title={`${d.label}: ${d.total}`}
            />

            {/* Label */}
            <span className="whitespace-nowrap text-xs text-slate-500">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
