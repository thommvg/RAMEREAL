<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ValoracionLugar;
use App\Models\ValoracionRestaurante;
use Illuminate\Support\Facades\Auth; // Necesario para obtener el ID del usuario

class ValoracionController extends Controller
{
    public function store(Request $request)
    {
        $messages = [
            'puntuacion.required' => 'Debes seleccionar una calificación.',
            'comentario.required' => 'El comentario no puede estar vacío.',
            'comentario.min'      => 'Cuéntanos un poco más (mínimo 10 caracteres).',
            'comentario.string'   => 'El comentario debe ser un texto válido.',
        ];

        $request->validate([
            'puntuacion' => 'required|integer|min:1|max:5',
            'comentario' => 'required|string|min:10',
            'entidad_id' => 'required|integer',
            'tipo'       => 'required|in:lugar,restaurante',
        ], $messages);

        // --- LA MAGIA PARA EL DASHBOARD ---
        $userId = Auth::id(); // Obtenemos el ID del usuario que está navegando

        if ($request->tipo === 'lugar') {
            ValoracionLugar::create([
                'lugares_id' => $request->entidad_id,
                'user_id'    => $userId, // Guardamos quién opinó
                'puntuacion' => $request->puntuacion,
                'comentario' => $request->comentario,
            ]);
        } else {
            ValoracionRestaurante::create([
                'restaurante_id' => $request->entidad_id,
                'user_id'        => $userId, // Guardamos quién opinó
                'puntuacion'     => $request->puntuacion,
                'comentario'     => $request->comentario,
            ]);
        }

        return redirect()->back()->with('success', '¡Tu opinión ha sido publicada!');
    }
}