<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MedicalRecord;

class MedicalRecordSeeder extends Seeder
{
    public function run(): void
    {
        MedicalRecord::create([
            'booking_id' => 1,
            'complaint' => 'Batuk dan demam sejak 3 hari.',
            'diagnosis' => 'Infeksi Saluran Pernapasan Atas (ISPA)',
            'treatment' => 'Pemeriksaan fisik dan pemberian terapi.',
            'prescription' => 'Paracetamol 500mg, Amoxicillin 500mg',
            'notes' => 'Kontrol kembali dalam 5 hari jika belum membaik.',
        ]);

        MedicalRecord::create([
            'booking_id' => 2,
            'complaint' => 'Kontrol kesehatan gigi.',
            'diagnosis' => 'Karies gigi ringan.',
            'treatment' => 'Pembersihan karang gigi.',
            'prescription' => 'Obat kumur antiseptik.',
            'notes' => 'Sikat gigi minimal 2 kali sehari.',
        ]);
    }
}