<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Doctor;

class DoctorSeeder extends Seeder
{
    public function run(): void
    {
        Doctor::create([
            'user_id' => 2,
            'photo' => null,
            'license_number' => 'DOC-0001',
            'specialist' => 'Dokter Umum',
            'phone' => '081234567890',
            'address' => 'Yogyakarta',
        ]);

        Doctor::create([
            'user_id' => 3,
            'photo' => null,
            'license_number' => 'DOC-0002',
            'specialist' => 'Dokter Gigi',
            'phone' => '081234567891',
            'address' => 'Sleman',
        ]);
    }
}