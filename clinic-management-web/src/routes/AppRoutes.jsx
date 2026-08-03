import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import Dashboard from "../pages/dashboard/Dashboard";
import DoctorsPage from "../pages/doctors/DoctorsPage";
import DoctorFormPage from "../pages/doctors/DoctorFormPage";
import DoctorDetailPage from "../pages/doctors/DoctorDetailPage";
import PatientsPage from "../pages/patients/PatientsPage";
import PatientFormPage from "../pages/patients/PatientFormPage";
import PatientDetailPage from "../pages/patients/PatientDetailPage";
import SchedulesPage from "../pages/schedules/SchedulesPage";
import ScheduleDetailPage from "../pages/schedules/ScheduleDetailPage";
import ScheduleFormPage from "../pages/schedules/ScheduleFormPage";
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
import ProfilePage from "../pages/profile/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/admin" element={<Dashboard />} />
          <Route path="/dashboard/doctor" element={<Dashboard />} />
          <Route path="/dashboard/patient" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/bookings/new" element={<BookingFormPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/bookings/:id/edit" element={<BookingFormPage />} />
          <Route path="/medical-records" element={<MedicalRecordsPage />} />
          <Route
            path="/medical-records/new"
            element={<MedicalRecordFormPage />}
          />
          <Route
            path="/medical-records/:id"
            element={<MedicalRecordDetailPage />}
          />
          <Route
            path="/medical-records/:id/edit"
            element={<MedicalRecordFormPage />}
          />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin", "doctor"]} />}>
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/:id" element={<PatientDetailPage />} />
          <Route path="/schedules" element={<SchedulesPage />} />
          <Route path="/schedules/:id" element={<ScheduleDetailPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/doctors" element={<DoctorsPage />} />
          <Route path="/doctors/new" element={<DoctorFormPage />} />
          <Route path="/doctors/:id" element={<DoctorDetailPage />} />
          <Route path="/doctors/:id/edit" element={<DoctorFormPage />} />
          <Route path="/patients/new" element={<PatientFormPage />} />
          <Route path="/patients/:id/edit" element={<PatientFormPage />} />
          <Route path="/schedules/new" element={<ScheduleFormPage />} />
          <Route path="/schedules/:id/edit" element={<ScheduleFormPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<UserFormPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/users/:id/edit" element={<UserFormPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["patient"]} />}>
          <Route path="/doctors" element={<DoctorsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
