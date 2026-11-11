<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DivisiController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\KandidatController;
use App\Http\Controllers\ParameterController;
use App\Http\Controllers\SPKController;
use App\Http\Controllers\TargetValueController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    // Auth profile & logout
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Master Divisi
    Route::apiResource('divisis', DivisiController::class);

    // Master Parameter & Target Profil
    Route::get('/parameters', [ParameterController::class, 'index']);
    Route::put('/parameters/{parameter}', [ParameterController::class, 'update']);
    Route::get('/target-values', [TargetValueController::class, 'index']);
    Route::post('/target-values/batch', [TargetValueController::class, 'batchUpdate']);

    // Data Kandidat
    Route::get('/kandidats/template/download', [KandidatController::class, 'downloadTemplate']);
    Route::post('/kandidats/import', [KandidatController::class, 'import']);
    Route::apiResource('kandidats', KandidatController::class);

    // SPK Multi-Stage Engine
    Route::post('/spk/run', [SPKController::class, 'run']);
    Route::get('/spk/sessions', [SPKController::class, 'sessions']);
    Route::get('/spk/sessions/{session}', [SPKController::class, 'sessionDetail']);
    Route::get('/spk/sessions/{session}/divisi/{divisiId}', [SPKController::class, 'divisiDetail']);
    Route::post('/spk/sessions/{session}/approve', [SPKController::class, 'approve']);
    Route::post('/spk/sessions/{session}/lock', [SPKController::class, 'lock']);

    // Export Reports
    Route::get('/export/excel/{session}', [ExportController::class, 'excel']);
    Route::get('/export/pdf/{session}', [ExportController::class, 'pdf']);
});
