<?php

namespace App\Http\Controllers;

use App\Models\ValoracionRestaurante; // Nombre corregido
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ValoracionRestaurantesController extends Controller
{
    /**
     * Muestra todas las valoraciones en el Dashboard (Para el Admin)
     */
    public function index()
    {
        // Traemos las valoraciones con la info del usuario y del restaurante
        $valoraciones = ValoracionRestaurante::with(['usuario', 'restaurante'])->latest()->get();

        return Inertia::render('Admin/ValoracionesRestaurantes', [
            'valoraciones' => $valoraciones
        ]);
    }

    /**
     * Guarda la reseña de un restaurante
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurante_id' => 'required|exists:restaurantes,id',
            'puntuacion'     => 'required|integer|min:1|max:5',
            'comentario'     => 'nullable|string|max:1000',
        ]);

        // Asignamos el ID del usuario logueado automáticamente
        $validated['user_id'] = Auth::id();

        ValoracionRestaurante::create($validated);

        return redirect()->back()->with('success', '¡Gracias por compartir tu experiencia!');
    }

    /**
     * Permite al admin eliminar una reseña inapropiada
     */
    public function destroy($id)
    {
        $valoracion = ValoracionRestaurante::findOrFail($id);
        $valoracion->delete();

        return redirect()->back()->with('success', 'La reseña ha sido eliminada.');
    }
}