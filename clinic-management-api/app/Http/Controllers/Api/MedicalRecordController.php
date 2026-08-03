<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MedicalRecordController extends Controller
{
    public function availableBookings(Request $request)
    {
        $bookings = Booking::with([
            'patient.user',
            'doctor.user',
            'schedule',
        ])
        ->whereDoesntHave('medicalRecord')
        ->whereIn('status', ['confirmed', 'completed']);

        // Filter hanya booking milik dokter tertentu (untuk role doctor)
        if ($request->has('doctor_id')) {
            $bookings->where('doctor_id', $request->integer('doctor_id'));
        }

        $bookings = $bookings->latest()->get();

        return response()->json($bookings);
    }
    public function index(Request $request)
    {
        $query = MedicalRecord::with([
            'booking.patient.user',
            'booking.doctor.user',
            'booking.schedule',
        ]);

        if ($request->has('doctor_id')) {
            $query->whereHas('booking', function ($bq) use ($request) {
                $bq->where('doctor_id', $request->integer('doctor_id'));
            });
        }

        if ($request->has('patient_id')) {
            $query->whereHas('booking', function ($bq) use ($request) {
                $bq->where('patient_id', $request->integer('patient_id'));
            });
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('diagnosis', 'like', "%{$search}%")
                    ->orWhere('complaint', 'like', "%{$search}%")
                    ->orWhereHas('booking', function ($bq) use ($search) {
                        $bq->where('booking_code', 'like', "%{$search}%")
                            ->orWhereHas('patient.user', function ($pq) use ($search) {
                                $pq->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        $sortBy = $request->query('sort_by', 'created_at');
        $sortDir = $request->query('sort_dir', 'desc') === 'asc' ? 'asc' : 'desc';

        $sortColumns = [
            'created_at' => 'created_at',
            'booking_date' => Booking::select('booking_date')
                ->whereColumn('bookings.id', 'medical_records.booking_id'),
        ];

        $column = $sortColumns[$sortBy] ?? $sortColumns['created_at'];

        $query->orderBy($column, $sortDir);

        return response()->json(
            $query->paginate($request->integer('per_page', 10))
        );
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