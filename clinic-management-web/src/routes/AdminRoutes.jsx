import Dashboard from "../pages/admin/Dashboard";
import DoctorsPage from "../pages/doctors/DoctorsPage";
import DoctorFormPage from "../pages/doctors/DoctorFormPage";
import DoctorDetailPage from "../pages/doctors/DoctorDetailPage";
import PatientsPage from "../pages/patients/PatientsPage";
import PatientFormPage from "../pages/patients/PatientFormPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import SchedulesPage from "../pages/schedules/SchedulesPage";
import ScheduleFormPage from "../pages/schedules/ScheduleFormPage";
import ScheduleDetailPage from "../pages/schedules/ScheduleDetailPage";
import BookingsPage from "../pages/bookings/BookingsPage";
import BookingFormPage from "../pages/bookings/BookingFormPage";
import BookingDetailPage from "../pages/bookings/BookingDetailPage";
import MedicalRecordsPage from "../pages/medical-records/MedicalRecordsPage";
import MedicalRecordFormPage from "../pages/medical-records/MedicalRecordFormPage";
import MedicalRecordDetailPage from "../pages/medical-records/MedicalRecordDetailPage";
import UsersPage from "../pages/users/UsersPage";
import UserFormPage from "../pages/users/UserFormPage";
import UserDetailPage from "../pages/users/UserDetailPage";
import ReportsPage from "../pages/reports/ReportsPage";

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
