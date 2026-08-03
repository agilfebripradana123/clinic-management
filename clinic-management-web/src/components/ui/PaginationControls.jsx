import Input from "./Input";

export default function PaginationControls({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalItems,
  totalPages,
}) {
  const pageOptions = [10, 25, 50, 100];
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2 md:flex-row md:items-center">
        <span className="text-sm text-slate-600">Tampilkan</span>

        <div className="w-28">
          <Input
            type="select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="!h-10"
          >
            {pageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Input>
        </div>

        <span className="text-sm text-slate-600">per halaman</span>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <span className="text-sm text-slate-600">
          Menampilkan {startItem}-{endItem} dari {totalItems} data
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            First
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-cyan-500 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
