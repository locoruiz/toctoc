<?php

use Illuminate\Support\Facades\Route;
use App\Mail\SolicitudMail;
use App\Models\Service;
use App\Models\User;
use App\Models\Direction;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/email/{id}', function($id) {
    $service = Service::find($id);
    $user = User::find($service->user_id);
    $direction = Direction::find($service->direction_id);
    return new SolicitudMail($service, $direction, $user);
});

Route::view('/{path?}', 'index');