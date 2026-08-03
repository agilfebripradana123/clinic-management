export default function Table({
  columns = [],
  data = [],
  emptyMessage = "Data tidak ditemukan.",
  renderRow,
  className = "",
}) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`
                  whitespace-nowrap
                  px-4
                  py-3
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-slate-600
                  border-b
                  border-slate-200
                  ${
                    column.align === "center"
                      ? "text-center"
                      : column.align === "right"
                        ? "text-right"
                        : "text-left"
                  }
                `}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-cyan-50/40"
              >
                {renderRow(item, index)}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-14 text-center text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
