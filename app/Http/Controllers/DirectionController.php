<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direction;

class DirectionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return auth()->user()->directions;
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
            'description' => 'required|string',
            'direction' => 'required|string',
            'referencia' => 'required|string',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'zona' => 'required|integer'
        ]);
        $direction = new Direction($data);

        $dir = auth()->user()->directions()->save($direction);

        return ['success' => true, 'message' => 'Guardado correctamente', 'direction' => $dir];
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
            'description' => 'required|string',
            'direction' => 'required|string',
            'referencia' => 'required|string',
            'latitud' => 'required|numeric',
            'longitud' => 'required|numeric',
            'zona' => 'required|integer'
        ]);

        $direction = Direction::find($id);
        $direction->description = $data['description'];
        $direction->direction = $data['direction'];
        $direction->referencia = $data['referencia'];
        $direction->latitud = $data['latitud'];
        $direction->longitud = $data['longitud'];
        $direction->zona = $data['zona'];
        $direction->save();
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
        $direction = Direction::find($id);
        try {
            $direction->delete();
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'No pudo eliminar, tiene solicitudes a esta dirección'];
        }

        return ['success' => true, 'message' => 'Eliminado correctamente'];
    }
}
