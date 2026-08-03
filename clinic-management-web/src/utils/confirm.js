import Swal from "sweetalert2";

export const confirmDelete = async (item = "data") => {
  const result = await Swal.fire({
    title: `Hapus ${item}?`,
    text: `Data ${item} yang dihapus tidak dapat dikembalikan.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, Hapus",
    cancelButtonText: "Batal",
    confirmButtonColor: "#06b6d4",
    cancelButtonColor: "#ef4444",
    reverseButtons: true,
  });

  return result.isConfirmed;
};
