<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Doctor;
use App\Models\MedicalRecord;
use App\Models\Patient;
use App\Models\Schedule;

class ReportService
{
    public function summary()
    {
        return [
            'total_patients' => Patient::count(),

            'total_doctors' => Doctor::count(),

            'total_bookings' => Booking::count(),

            'total_medical_records' => MedicalRecord::count(),

            'total_schedules' => Schedule::count(),

            'today_bookings' => Booking::whereDate(
                'booking_date',
                today()
            )->count(),

            'completed_bookings' => Booking::where(
                'status',
                'completed'
            )->count(),

            'pending_bookings' => Booking::where(
                'status',
                'pending'
            )->count(),
        ];
    }
}