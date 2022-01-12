<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DirectionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ChatController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login']);
Route::post('/createCode', [AuthController::class, 'createCode']);
Route::get('/prueba', [AuthController::class, 'prueba']);
Route::post('/webhook', [ChatController::class, 'webhook']);
Route::post('/fallback', [ChatController::class, 'fallback']);
Route::post('/callback', [ChatController::class, 'callback']);

Route::group(['middleware' => ['auth:sanctum']], function() {
    //Rutas autenticadas!
    Route::get('/prueba', [AuthController::class, 'prueba']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Direcciones
    Route::get('/directions', [DirectionController::class, 'index']);
    Route::post('/directions', [DirectionController::class, 'store']);
    Route::put('/directions/{id}', [DirectionController::class, 'update']);
    Route::delete('/directions/{id}', [DirectionController::class, 'destroy']);

    // Servicios
    Route::get('/services', [ServiceController::class, 'index']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{id}', [ServiceController::class, 'update']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);
    Route::get('/services/all', [ServiceController::class, 'all']);
});