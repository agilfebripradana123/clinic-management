import useAuth from "./useAuth";

// Mengembalikan prefix URL untuk role user yang sedang login.
// Contoh: admin → "/admin", doctor → "/doctor", patient → "/patient".
// Digunakan agar navigasi antar halaman selalu mengarah ke rute milik role sendiri.
export default function useRoleBase() {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase() || "admin";

  return `/${role}`;
}
