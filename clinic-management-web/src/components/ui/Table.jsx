export default function Table({
  columns = [],
  data = [],
  emptyMessage = "Data tidak ditemukan.",
  renderRow,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-slate-100">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-sm font-semibold text-slate-700 ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
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
