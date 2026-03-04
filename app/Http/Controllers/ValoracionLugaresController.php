<?php

namespace App\Http\Controllers;

use App\Models\Valoracion_lugares;
use App\Models\Lugar; // Importamos el modelo Lugar para que no de error
use Illuminate\Http\Request;

class ValoracionLugaresController extends Controller
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
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'ciudad' => 'required|string|max:255',
            'imagen' => 'required|string', 
            'puntuacion' => 'required|numeric|min:1|max:5', // Ahora acepta desde 1 estrella
        ]);

        // Guardamos en la tabla lugares
        Lugar::create($validated); 

        // Enviamos el mensaje de éxito a la sesión
        return redirect()->back()->with('success', '¡Excelente! El lugar se ha guardado correctamente en Rame.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Valoracion_lugares $valoracion_lugares)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Valoracion_lugares $valoracion_lugares)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Valoracion_lugares $valoracion_lugares)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Valoracion_lugares $valoracion_lugares)
    {
        //
    }
}