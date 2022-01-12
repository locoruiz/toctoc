<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

use App\Models\User;
use App\Models\Code;
use App\Models\Whatsapp;

use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * Enviar codigo
     */
    public function createCode(Request $request) {
        $data = $request->validate(['phone' => 'required|string']);
        $expira = new \DateTime();
        $expira->modify('+1 hour');
        $codigo = rand(1111, 9999);
        $phone = $data['phone'];
        if (substr($phone, 0, 1) != '+') {
            $phone = '+'.$phone;
        }
        $code = Code::create([
            'phone' => $phone,
            'code' => $codigo,
            'expira' => $expira
        ]);

        $user = User::where('phone', $phone)->first();

        $nombreAnterior = '';
        if (!$user) {
            // no tiene usuario
        } else {
            $nombreAnterior = $user->name;
        }

        $whatsapp = new Whatsapp();

        $whatsapp->enviarCodigoDeVerificacion($codigo, $data['phone']);
        
        return ['success' => true, 'message' => 'Codigo creado ', 'nombreAnterior' => $nombreAnterior];
    }

    public function prueba() {
        return ['message' => 'que pasa a ver: ', 'user' => auth()->user()->get()[0]->id];
    }

    /**
     * Login user and create token
     *
     * ...
     */
    public function login(Request $request)
    {
        $data = $request->validate([
            'name' => 'string',
            'phone' => 'required|string',
            'code' => 'required|integer'
        ]);

        $fecha = new \DateTime();
        $f = $fecha->format('Y-m-d H:i:s');

        $phone = $data['phone'];
        if (substr($phone, 0, 1) != '+') {
            $phone = '+'.$phone;
        }

        // Ver que exista el codigo
        $codes = DB::table('codes')
            ->where('phone', '=', $phone)
            ->where('code', '=', $data['code'])
            ->where('expira', '>', $f)
            ->get();
            
        if (count($codes) == 0) {
            return response([
                'success' => false,
                'message' => 'Codigo incorrecto'
            ]);
        }
        //TODO: Eliminar el codigo!
        $user = User::where('phone', $phone)->first();
        $name = null;
        if (isset($data['name']) && !empty($data['name'])) {
            $name = $data['name'];
        }
        if (!$user) {
            $user = User::create([
                'name' => $data['name'],
                'phone' => $phone
            ]);
        }

        $token = $user->createToken('TocToc')->plainTextToken;
        return response([
            'success' => true,
            'token' => $token,
            'user' => $user,
            'direcciones' => $user->directions
        ]);
    }
    /**
     * Log out
     */
    public function logout(Request $request) {
        auth()->user()->tokens()->delete();
        return ['message' => 'Salio correctamente'];
    }

}
