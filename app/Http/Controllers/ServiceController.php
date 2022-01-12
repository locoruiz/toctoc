<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\User;
use App\Models\Direction;
use App\Models\Whatsapp;
use App\Mail\SolicitudMail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ServiceController extends Controller
{
    /**
     * lista de servicios del usuario.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $services = auth()->user()->services;
        for($i = 0; $i < count($services); $i++) {
            $s = $services[$i];
            $direction = Direction::find($s['direction_id']);
            $s['direccion'] = $direction;
        }

        return $services;
    }

    /**
     * Lista de todos los servicios
     *
     * @return \Illuminate\Http\Response
     */
    public function all()
    {
        $services = [];
        try{
            if (auth()->user()->role != 'Admin') {
                return \Illuminate\Http\Response::json(['message' => 'No autorizado'], 403);
            }
            $services = Service::all();
            for($i = 0; $i < count($services); $i++) {
                $s = $services[$i];
                $direction = Direction::find($s['direction_id']);
                $s['direccion'] = $direction;
                $user = User::find($s['user_id']);
                $s['nombre'] = $user->name;
                $s['numero'] = $user->phone;
            }
        } catch (\Exception $e) {
            Log::channel('custom')->info("Error al obtener servicios: ".$e->getMessage());
        }

        return $services;
    }
    

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'tipo' => 'required|string',
            'tipoCasa' => 'required|string',
            'tipoProfunda' => 'string',
            'horas' => 'required|numeric',
            'precio' => 'required|numeric',
            'horasCompartidas' => 'required|numeric',
            'profesionales' => 'required|integer',
            'cuartos' => 'required|integer',
            'banos' => 'required|integer',
            'horasPlanchado' => 'required|integer',
            'referencia' => 'required|integer',
            'opcionales' => 'required|json',
            'materialesExtras' => 'required|json',
            'fecha' => 'required|date',
            'hora' => 'required|json',
            'direction_id' => 'required|integer'
        ]);



        $service = new Service($data);

        $dir = auth()->user()->services()->save($service);

        $whatsapp = new Whatsapp();
        $whatsapp->enviarMensajeDeConfirmacion($dir->id, auth()->user()->phone);

        $direction = Direction::find($data['direction_id']);

        try {
            $correo = new SolicitudMail($dir, $direction, auth()->user());
            // Enviar correo a TocToc
            Mail::to('matiasmartinezruiz92@gmail.com')->send($correo);
            Mail::to('ricardo.ruiz.romero.89@gmail.com')->send($correo);
            Log::channel('custom')->info('correos enviados correctamente...');
        } catch (\Exception $e) {
            Log::channel('custom')->info("Error al enviar el correo: ".$e->getMessage());
        }

        return ['success' => true, 'message' => 'Servicio solicitado correctamente', 'service' => $dir];
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->validate([
        ]);

        $service = Service::find($id);
        //TODO: Ver si actualizamos algo
        $service->save();
        
        return ['success' => true, 'message' => 'Actualizado correctamente'];
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $direction = Service::find($id);
        $direction->delete();

        return ['success' => true, 'message' => 'Eliminado correctamente'];
    }
}
