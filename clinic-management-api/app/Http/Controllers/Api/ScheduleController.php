<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ScheduleController extends Controller
{
    /**
     * Display a listing of schedules.
     */
    public function index()
    {
        return response()->json(
            Schedule::with('doctor.user')
                ->latest()
                ->get()
        );
    }

    /**
     * Store a newly created schedule.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',

            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',

            'start_time' => 'required|date_format:H:i',

            'end_time' => 'required|date_format:H:i|after:start_time',

            'is_active' => 'sometimes|boolean',
        ]);

        $isConflict = Schedule::where('doctor_id', $validated['doctor_id'])
            ->where('day', $validated['day'])
            ->where(function ($query) use ($validated) {

                $query
                    ->whereBetween('start_time', [
                        $validated['start_time'],
                        $validated['end_time'],
                    ])

                    ->orWhereBetween('end_time', [
                        $validated['start_time'],
                        $validated['end_time'],
                    ])

                    ->orWhere(function ($q) use ($validated) {

                        $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Jadwal dokter bentrok dengan jadwal yang sudah ada.',
            ], 422);
        }

        $schedule = DB::transaction(function () use ($validated) {

            return Schedule::create([
                'doctor_id' => $validated['doctor_id'],
                'day' => $validated['day'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'is_active' => $validated['is_active'] ?? true,
            ]);
        });

        return response()->json([
            'message' => 'Schedule created successfully',
            'data' => $schedule->load('doctor.user'),
        ], 201);
    }

    /**
     * Display the specified schedule.
     */
    public function show(Schedule $schedule)
    {
        return response()->json(
            $schedule->load('doctor.user')
        );
    }

    /**
     * Update the specified schedule.
     */
    public function update(Request $request, Schedule $schedule)
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',

            'day' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',

            'start_time' => 'required|date_format:H:i',

            'end_time' => 'required|date_format:H:i|after:start_time',

            'is_active' => 'sometimes|boolean',
        ]);

        $isConflict = Schedule::where('doctor_id', $validated['doctor_id'])
            ->where('day', $validated['day'])
            ->where('id', '!=', $schedule->id)
            ->where(function ($query) use ($validated) {

                $query
                    ->whereBetween('start_time', [
                        $validated['start_time'],
                        $validated['end_time'],
                    ])

                    ->orWhereBetween('end_time', [
                        $validated['start_time'],
                        $validated['end_time'],
                    ])

                    ->orWhere(function ($q) use ($validated) {

                        $q->where('start_time', '<=', $validated['start_time'])
                            ->where('end_time', '>=', $validated['end_time']);
                    });
            })
            ->exists();

        if ($isConflict) {
            return response()->json([
                'message' => 'Jadwal dokter bentrok dengan jadwal yang sudah ada.',
            ], 422);
        }

        DB::transaction(function () use ($validated, $schedule) {

            $schedule->update([
                'doctor_id' => $validated['doctor_id'],
                'day' => $validated['day'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'is_active' => $validated['is_active'] ?? true,
            ]);
        });

        return response()->json([
            'message' => 'Schedule updated successfully',
            'data' => $schedule->fresh()->load('doctor.user'),
        ]);
    }

    /**
     * Remove the specified schedule.
     */
    public function destroy(Schedule $schedule)
    {
        DB::transaction(function () use ($schedule) {

            $schedule->delete();

        });

        return response()->json([
            'message' => 'Schedule deleted successfully',
        ]);
    }
}