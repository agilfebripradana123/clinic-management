<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class PatientController extends Controller
{
    public function index()
    {
        return response()->json(
            Patient::with('user')->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',

            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $patient = DB::transaction(function () use ($validated) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            $lastPatient = Patient::withTrashed()
                ->orderByDesc('id')
                ->first();

            $nextNumber = $lastPatient ? $lastPatient->id + 1 : 1;

            $medicalRecordNumber = 'RM-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);
            return Patient::create([
                'user_id' => $user->id,
                'medical_record_number' => $medicalRecordNumber,
                'gender' => $validated['gender'],
                'birth_date' => $validated['birth_date'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'is_active' => $validated['is_active'] ?? true,
            ]);
        });

        return response()->json([
            'message' => 'Patient created successfully',
            'data' => $patient->load('user'),
        ], 201);
    }

    public function show(Patient $patient)
    {
        return response()->json(
            $patient->load('user')
        );
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',

            'email' => 'required|email|unique:users,email,' . $patient->user_id,

            'password' => 'nullable|string|min:8',

            'medical_record_number' => 'required|string|unique:patients,medical_record_number,' . $patient->id,

            'gender' => 'required|in:L,P',

            'birth_date' => 'required|date',

            'phone' => 'required|string|max:20',

            'address' => 'required|string',

            'is_active' => 'sometimes|boolean',
        ]);

        DB::transaction(function () use ($validated, $patient) {

            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $patient->user()->update($userData);

            $patient->update([
                'medical_record_number' => $validated['medical_record_number'],
                'gender' => $validated['gender'],
                'birth_date' => $validated['birth_date'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'is_active' => $validated['is_active'] ?? $patient->is_active,
            ]);
        });

        return response()->json([
            'message' => 'Patient updated successfully',
            'data' => $patient->fresh()->load('user'),
        ]);
    }

    public function destroy(Patient $patient)
    {
        DB::transaction(function () use ($patient) {

            $user = $patient->user;

            $patient->delete();

            if ($user) {
                $user->delete();
            }
        });

        return response()->json([
            'message' => 'Patient deleted successfully',
        ]);
    }
}