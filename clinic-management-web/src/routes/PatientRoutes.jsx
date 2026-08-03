import Dashboard from "../pages/patient/Dashboard";
import DoctorsPage from "../pages/patient/doctors/DoctorsPage";
import BookingsPage from "../pages/patient/bookings/BookingsPage";
import BookingFormPage from "../pages/patient/bookings/BookingFormPage";
import BookingDetailPage from "../pages/patient/bookings/BookingDetailPage";
import MedicalRecordsPage from "../pages/patient/medical-records/MedicalRecordsPage";
import MedicalRecordDetailPage from "../pages/patient/medical-records/MedicalRecordDetailPage";

// Definisi rute khusus role patient.
// Path relatif terhadap <ProtectedRoute roles={["patient"]} />.
// Pasien: lihat dokter, kelola booking sendiri, lihat riwayat rekam medis.
const patientRoutes = [
  { path: "patient/dashboard", element: <Dashboard /> },

  // Daftar Dokter
  { path: "patient/doctors", element: <DoctorsPage /> },

  // Booking
  { path: "patient/bookings", element: <BookingsPage /> },
  { path: "patient/bookings/new", element: <BookingFormPage /> },
  { path: "patient/bookings/:id", element: <BookingDetailPage /> },
  { path: "patient/bookings/:id/edit", element: <BookingFormPage /> },

  // Riwayat Rekam Medis
  { path: "patient/medical-records", element: <MedicalRecordsPage /> },
  { path: "patient/medical-records/:id", element: <MedicalRecordDetailPage /> },
];

export default patientRoutes;
