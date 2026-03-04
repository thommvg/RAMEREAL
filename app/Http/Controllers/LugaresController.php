<?php

namespace App\Http\Controllers;

use App\Models\Lugar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;


class LugaresController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required',
            'descripcion' => 'required',
            'direccion' => 'required',
        ]);

        // Consultar OpenStreetMap
        $response = Http::withHeaders([
            'User-Agent' => 'RameProject/1.0'
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $request->direccion,
            'format' => 'json',
            'limit' => 1
        ]);

        $data = $response->json();

        $lat = null;
        $lng = null;

        if (!empty($data)) {
            $lat = $data[0]['lat'];
            $lng = $data[0]['lon'];

            dd($lat, $lng);
            
        }

        Lugar::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'direccion' => $request->direccion,
            'lat' => $lat,
            'lng' => $lng,
        ]);

        return redirect()->back()->with('success', 'Lugar creado correctamente');
    }


    /**
     * Display the specified resource.
     */
    public function show(Lugar $lugares)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Lugar $lugares)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Lugar $lugares)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lugar $lugares)
    {
        //
    }
}
