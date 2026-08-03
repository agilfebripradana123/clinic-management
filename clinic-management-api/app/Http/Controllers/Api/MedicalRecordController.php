<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicalRecordController extends Controller
{
    public function availableBookings()
    {
        $bookings = Booking::with([
            'patient.user',
            'doctor.user',
            'schedule',
        ])
        ->whereDoesntHave('medicalRecord')
        ->whereIn('status', ['confirmed', 'completed'])
        ->latest()
        ->get();

        return response()->json($bookings);
    }
    public function index()
    {
        $records = MedicalRecord::with([
            'booking.patient.user',
            'booking.doctor.user',
            'booking.schedule',
        ])->latest()->get();

        return response()->json($records);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'booking_id'   => 'required|exists:bookings,id|unique:medical_records,booking_id',
            'complaint'    => 'required|string',
            'diagnosis'    => 'required|string',
            'treatment'    => 'required|string',
            'prescription' => 'nullable|string',
            'notes'        => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            $booking = Booking::findOrFail($validated['booking_id']);

            $record = MedicalRecord::create($validated);

            $booking->update([
                'status' => 'completed',
            ]);

            DB::commit();

            return response()->json(
                $record->load([
                    'booking.patient.user',
                    'booking.doctor.user',
                    'booking.schedule',
                ]),
                201
            );

        } catch (\Throwable $e) {

            DB::rollBack();

            return response()->json([
                'message' => $e->getMessage(),
            ],500);
        }
    }

    public function show(MedicalRecord $medicalRecord)
    {
        return response()->json(
            $medicalRecord->load([
                'booking.patient.user',
                'booking.doctor.user',
                'booking.schedule',
            ])
        );
    }

    public function update(Request $request, MedicalRecord $medicalRecord)
    {
        $validated = $request->validate([
            'complaint'    => 'required|string',
            'diagnosis'    => 'required|string',
            'treatment'    => 'required|string',
            'prescription' => 'nullable|string',
            'notes'        => 'nullable|string',
        ]);

        $medicalRecord->update($validated);

        return response()->json(
            $medicalRecord->load([
                'booking.patient.user',
                'booking.doctor.user',
                'booking.schedule',
            ])
        );
    }

    public function destroy(MedicalRecord $medicalRecord)
    {
        $medicalRecord->delete();

        return response()->json([
            'message' => 'Medical record deleted successfully.'
        ]);
    }
}