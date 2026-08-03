import Dashboard from "../pages/doctor/Dashboard";
import SchedulesPage from "../pages/doctor/schedules/SchedulesPage";
import ScheduleFormPage from "../pages/doctor/schedules/ScheduleFormPage";
import ScheduleDetailPage from "../pages/doctor/schedules/ScheduleDetailPage";
import PatientsPage from "../pages/doctor/patients/PatientsPage";
import PatientDetailPage from "../pages/doctor/patients/PatientDetailPage";
import MedicalRecordsPage from "../pages/doctor/medical-records/MedicalRecordsPage";
import MedicalRecordFormPage from "../pages/doctor/medical-records/MedicalRecordFormPage";
import MedicalRecordDetailPage from "../pages/doctor/medical-records/MedicalRecordDetailPage";

// Definisi rute khusus role doctor.
// Path relatif terhadap <ProtectedRoute roles={["doctor"]} />.
// Dokter: lihat jadwal & kelola jadwal praktik, lihat pasien, kelola rekam medis.
const doctorRoutes = [
  { path: "doctor/dashboard", element: <Dashboard /> },

  // Jadwal Praktik
  { path: "doctor/schedules", element: <SchedulesPage /> },
  { path: "doctor/schedules/new", element: <ScheduleFormPage /> },
  { path: "doctor/schedules/:id", element: <ScheduleDetailPage /> },
  { path: "doctor/schedules/:id/edit", element: <ScheduleFormPage /> },

  // Daftar Pasien
  { path: "doctor/patients", element: <PatientsPage /> },
  { path: "doctor/patients/:id", element: <PatientDetailPage /> },

  // Rekam Medis
  { path: "doctor/medical-records", element: <MedicalRecordsPage /> },
  { path: "doctor/medical-records/new", element: <MedicalRecordFormPage /> },
  { path: "doctor/medical-records/:id", element: <MedicalRecordDetailPage /> },
  { path: "doctor/medical-records/:id/edit", element: <MedicalRecordFormPage /> },
];

export default doctorRoutes;
