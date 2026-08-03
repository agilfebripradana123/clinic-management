import Dashboard from "../pages/admin/Dashboard";
import DoctorsPage from "../pages/admin/doctors/DoctorsPage";
import DoctorFormPage from "../pages/admin/doctors/DoctorFormPage";
import DoctorDetailPage from "../pages/admin/doctors/DoctorDetailPage";
import PatientsPage from "../pages/admin/patients/PatientsPage";
import PatientFormPage from "../pages/admin/patients/PatientFormPage";
import PatientDetailPage from "../pages/admin/patients/PatientDetailPage";
import SchedulesPage from "../pages/admin/schedules/SchedulesPage";
import ScheduleFormPage from "../pages/admin/schedules/ScheduleFormPage";
import ScheduleDetailPage from "../pages/admin/schedules/ScheduleDetailPage";
import BookingsPage from "../pages/admin/bookings/BookingsPage";
import BookingFormPage from "../pages/admin/bookings/BookingFormPage";
import BookingDetailPage from "../pages/admin/bookings/BookingDetailPage";
import MedicalRecordsPage from "../pages/admin/medical-records/MedicalRecordsPage";
import MedicalRecordFormPage from "../pages/admin/medical-records/MedicalRecordFormPage";
import MedicalRecordDetailPage from "../pages/admin/medical-records/MedicalRecordDetailPage";
import UsersPage from "../pages/admin/users/UsersPage";
import UserFormPage from "../pages/admin/users/UserFormPage";
import UserDetailPage from "../pages/admin/users/UserDetailPage";
import ReportsPage from "../pages/admin/reports/ReportsPage";

// Definisi rute khusus role admin.
// Path relatif terhadap <ProtectedRoute roles={["admin"]} />.
// Admin mendapat akses penuh ke semua modul.
const adminRoutes = [
  { path: "admin/dashboard", element: <Dashboard /> },

  // Dokter
  { path: "admin/doctors", element: <DoctorsPage /> },
  { path: "admin/doctors/new", element: <DoctorFormPage /> },
  { path: "admin/doctors/:id", element: <DoctorDetailPage /> },
  { path: "admin/doctors/:id/edit", element: <DoctorFormPage /> },

  // Pasien
  { path: "admin/patients", element: <PatientsPage /> },
  { path: "admin/patients/new", element: <PatientFormPage /> },
  { path: "admin/patients/:id", element: <PatientDetailPage /> },
  { path: "admin/patients/:id/edit", element: <PatientFormPage /> },

  // Jadwal
  { path: "admin/schedules", element: <SchedulesPage /> },
  { path: "admin/schedules/new", element: <ScheduleFormPage /> },
  { path: "admin/schedules/:id", element: <ScheduleDetailPage /> },
  { path: "admin/schedules/:id/edit", element: <ScheduleFormPage /> },

  // Booking
  { path: "admin/bookings", element: <BookingsPage /> },
  { path: "admin/bookings/new", element: <BookingFormPage /> },
  { path: "admin/bookings/:id", element: <BookingDetailPage /> },
  { path: "admin/bookings/:id/edit", element: <BookingFormPage /> },

  // Rekam Medis
  { path: "admin/medical-records", element: <MedicalRecordsPage /> },
  { path: "admin/medical-records/new", element: <MedicalRecordFormPage /> },
  { path: "admin/medical-records/:id", element: <MedicalRecordDetailPage /> },
  { path: "admin/medical-records/:id/edit", element: <MedicalRecordFormPage /> },

  // User
  { path: "admin/users", element: <UsersPage /> },
  { path: "admin/users/new", element: <UserFormPage /> },
  { path: "admin/users/:id", element: <UserDetailPage /> },
  { path: "admin/users/:id/edit", element: <UserFormPage /> },

  // Laporan
  { path: "admin/reports", element: <ReportsPage /> },
];

export default adminRoutes;
