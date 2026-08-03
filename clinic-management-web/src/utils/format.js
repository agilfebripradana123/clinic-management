export function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export function formatDateInput(date) {
  if (!date) return "";

  return new Date(date).toISOString().split("T")[0];
}
