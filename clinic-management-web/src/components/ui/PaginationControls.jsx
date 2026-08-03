import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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

  const pageNumbers = getPageNumbers(currentPage, totalPages);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const btnBase =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-semibold transition-all duration-200";

  return (
    <div className="mt-5 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
      {/* Info halaman */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="text-sm text-slate-600">Tampilkan</span>

        <div className="w-24">
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-slate-500">
          Menampilkan <b>{startItem}</b>–<b>{endItem}</b> dari{" "}
          <b>{totalItems}</b> data
        </span>

        {/* Navigasi halaman */}
        <nav className="flex items-center gap-1.5" aria-label="Navigasi halaman">
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className={`${btnBase} border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="Halaman pertama"
            title="Halaman pertama"
          >
            <ChevronsLeft size={16} />
          </button>

          <button
            type="button"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${btnBase} border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="Halaman sebelumnya"
            title="Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>

          {pageNumbers.map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-sm text-slate-400"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`${btnBase} ${
                  page === currentPage
                    ? "border-cyan-500 bg-cyan-500 text-white shadow-sm"
                    : "border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            ),
          )}

          <button
            type="button"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${btnBase} border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="Halaman berikutnya"
            title="Berikutnya"
          >
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`${btnBase} border-slate-200 text-slate-600 hover:border-cyan-300 hover:text-cyan-600 disabled:cursor-not-allowed disabled:opacity-40`}
            aria-label="Halaman terakhir"
            title="Halaman terakhir"
          >
            <ChevronsRight size={16} />
          </button>
        </nav>
      </div>
    </div>
  );
}

// Nomor halaman dengan elipsis — "1 … 4 5 6 … 20"
function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current - 1, current, current + 1]);

  const result = [];
  let prev = 0;

  [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b)
    .forEach((page) => {
      if (prev && page - prev > 1) {
        result.push("...");
      }

      result.push(page);
      prev = page;
    });

  return result;
}
