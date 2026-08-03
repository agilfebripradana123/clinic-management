<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        // Dokter 1
        Schedule::create([
            'doctor_id' => 1,
            'day' => 'Monday',
            'start_time' => '08:00:00',
            'end_time' => '11:00:00',
            'is_active' => true,
        ]);

        Schedule::create([
            'doctor_id' => 1,
            'day' => 'Wednesday',
            'start_time' => '13:00:00',
            'end_time' => '16:00:00',
            'is_active' => true,
        ]);

        // Dokter 2
        Schedule::create([
            'doctor_id' => 2,
            'day' => 'Tuesday',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
            'is_active' => true,
        ]);

        Schedule::create([
            'doctor_id' => 2,
            'day' => 'Friday',
            'start_time' => '09:00:00',
            'end_time' => '14:00:00',
            'is_active' => true,
        ]);
    }
}