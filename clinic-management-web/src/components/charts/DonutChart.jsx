// Donut chart SVG ringan — tanpa library chart.
// `data`: [{ label, value, color }]. Warna di-assign dari luar (status/kategori).
export default function DonutChart({
  data = [],
  size = 160,
  thickness = 18,
  centerLabel = "",
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (total === 0 || data.length === 0) return null;

  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d) => {
            const frac = d.value / total;
            const dash = frac * c;
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </circle>
            );
            offset += dash;
            return seg;
          })}
        </g>

        <text
          x={size / 2}
          y={size / 2 - 4}
          textAnchor="middle"
          className="fill-slate-900 text-sm font-bold"
        >
          {total}
        </text>

        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          className="fill-slate-400 text-[10px]"
        >
          {centerLabel}
        </text>
      </svg>

      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />

            <span className="text-slate-600">{d.label}</span>

            <span className="ml-auto font-semibold text-slate-800">
              {d.value}
            </span>

            <span className="w-10 text-right text-xs text-slate-400">
              {Math.round((d.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
