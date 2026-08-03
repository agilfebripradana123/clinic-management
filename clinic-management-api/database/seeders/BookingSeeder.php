<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        Booking::create([
            'doctor_id' => 1,
            'patient_id' => 1,
            'schedule_id' => 1,
            'booking_code' => 'BK-20260811-001',
            'booking_date' => '2026-08-11',
            'queue_number' => 1,
            'status' => 'confirmed',
            'notes' => 'Batuk dan demam sejak 3 hari.',
        ]);

        Booking::create([
            'doctor_id' => 2,
            'patient_id' => 2,
            'schedule_id' => 4,
            'booking_code' => 'BK-20260812-001',
            'booking_date' => '2026-08-12',
            'queue_number' => 1,
            'status' => 'pending',
            'notes' => 'Kontrol gigi.',
        ]);
    }
}