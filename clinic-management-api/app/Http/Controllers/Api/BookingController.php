<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::with([
            'doctor.user',
            'patient.user',
            'schedule'
        ])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    /**
     * Store a newly created resource.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id'    => 'required|exists:doctors,id',
            'patient_id'   => 'required|exists:patients,id',
            'schedule_id'  => 'required|exists:schedules,id',
            'booking_date' => 'required|date',
            'status'       => 'required|in:pending,confirmed,completed,cancelled',
            'notes'        => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            $lastBooking = Booking::withTrashed()
                ->latest('id')
                ->first();

            $nextNumber = $lastBooking
                ? $lastBooking->id + 1
                : 1;

            $bookingCode = 'BK' .
                now()->format('Ymd') .
                str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            $queueNumber = Booking::whereDate(
                'booking_date',
                $validated['booking_date']
            )->count() + 1;

            $booking = Booking::create([
                'doctor_id'     => $validated['doctor_id'],
                'patient_id'    => $validated['patient_id'],
                'schedule_id'   => $validated['schedule_id'],
                'booking_code'  => $bookingCode,
                'booking_date'  => $validated['booking_date'],
                'queue_number'  => $queueNumber,
                'status'        => $validated['status'],
                'notes'         => $validated['notes'] ?? null,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Booking berhasil dibuat.',
                'data' => $booking->load([
                    'doctor.user',
                    'patient.user',
                    'schedule'
                ])
            ], 201);

        } catch (\Throwable $th) {

            DB::rollBack();

            return response()->json([
                'message' => 'Gagal membuat booking.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        return response()->json(
            $booking->load([
                'doctor.user',
                'patient.user',
                'schedule'
            ])
        );
    }

    /**
     * Update the specified resource.
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'doctor_id'    => 'sometimes|required|exists:doctors,id',
            'patient_id'   => 'sometimes|required|exists:patients,id',
            'schedule_id'  => 'sometimes|required|exists:schedules,id',
            'booking_date' => 'sometimes|required|date',
            'status'       => 'sometimes|required|in:pending,confirmed,completed,cancelled',
            'notes'        => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {

            $booking->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Booking berhasil diperbarui.',
                'data' => $booking->fresh()->load([
                    'doctor.user',
                    'patient.user',
                    'schedule'
                ])
            ]);

        } catch (\Throwable $th) {

            DB::rollBack();

            return response()->json([
                'message' => 'Gagal memperbarui booking.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource.
     */
    public function destroy(Booking $booking)
    {
        try {

            $booking->delete();

            return response()->json([
                'message' => 'Booking berhasil dihapus.'
            ]);

        } catch (\Throwable $th) {

            return response()->json([
                'message' => 'Gagal menghapus booking.',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}