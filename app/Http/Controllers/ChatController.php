<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\Whatsapp;

class ChatController extends Controller {
    public function webhook(Request $request) {
        // Cuanto llegan los mensajes
        //Log::channel('mensajes')->info("Llego un mensaje!!");
        //Log::channel('mensajes')->info(json_encode($request->post(), JSON_PRETTY_PRINT));
        $datos = $request->post();
        try {
            $ws = new Whatsapp();

            
            Log::channel('custom')->info('Mensaje respondido correctamente');
        } catch (\Exception $e) {
            Log::channel('custom')->info('Error al responder... '.$e->getMessage());
        } catch (\Throwable $e) {
            Log::channel('custom')->info('Error al responder... '.$e->getMessage());
        }
    }
    public function fallback(Request $request) {
        // cuando hay un error al enviarnos nuestros mensajes
        Log::channel('mensajes')->info("Metodo fallback, hubo algun error en los mensajes");
        Log::channel('mensajes')->info(json_encode($request->post(), JSON_PRETTY_PRINT));
    }
    public function callback(Request $request) {
        // Para ver el estado de los mensajes enviados
        //Log::channel('mensajes')->info("Metodo callback, estado de los mensajes");
        //Log::channel('mensajes')->info(json_encode($request->post(), JSON_PRETTY_PRINT));
    }
}