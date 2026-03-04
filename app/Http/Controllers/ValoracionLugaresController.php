<?php

namespace App\Http\Controllers;

use App\Models\ValoracionLugar; // Asegúrate de que el nombre coincida con tu modelo
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ValoracionLugaresController extends Controller
{
    /**
     * Guarda la reseña que el usuario hace de un lugar
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'lugares_id' => 'required|exists:lugares,id', // El lugar debe existir
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:500',
        ]);

        // Agregamos el ID del usuario que está logueado automáticamente
        $validated['user_id'] = Auth::id();

        // Guardamos en la tabla de VALORACIONES, no en la de lugares
        ValoracionLugar::create($validated); 

        return redirect()->back()->with('success', '¡Gracias por calificar este lugar en Rame!');
    }

    /**
     * Para mostrar las valoraciones en el Dashboard del Admin
     */
    public function index()
    {
        // Traemos las valoraciones con el nombre del usuario y el nombre del lugar
        $valoraciones = ValoracionLugar::with(['usuario', 'lugar'])->latest()->get();
        
        // Aquí retornarías a tu vista de React/Inertia
        // return Inertia::render('Admin/ValoracionesLugares', ['valoraciones' => $valoraciones]);
    }
}