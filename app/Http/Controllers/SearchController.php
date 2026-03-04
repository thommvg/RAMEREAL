<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lugar;
use App\Models\Restaurante;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $city = $request->input('city');
        $stars = $request->input('stars');

        // 1. Consulta de Lugares
        $lugares = Lugar::query()
            ->with(['valoraciones.user:id,name']) 
            ->withAvg('valoraciones', 'puntuacion')
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->when($city, function ($query, $city) {
                $query->where('ciudad', $city);
            })
            ->get()
            ->map(function($item) {
                $item->tipo = 'Lugar';
                $item->puntuacion_final = $item->valoraciones_avg_puntuacion ?? 0;
                return $item;
            });

        // 2. Consulta de Restaurantes
        $restaurantes = Restaurante::query()
            ->with(['valoraciones.user:id,name'])
            ->withAvg('valoraciones', 'puntuacion')
            ->when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->when($city, function ($query, $city) {
                $query->where('ciudad', $city);
            })
            ->get()
            ->map(function($item) {
                $item->tipo = 'Restaurante';
                $item->puntuacion_final = $item->valoraciones_avg_puntuacion ?? 0;
                return $item;
            });

        // 3. Unir colecciones
        $resultados = $lugares->concat($restaurantes);

        // 4. FILTRO DE ESTRELLAS EXACTO (Rango de la estrella seleccionada)
        if ($stars !== null && $stars !== '') {
            $starsValue = (float)$stars;
            $resultados = $resultados->filter(function($item) use ($starsValue) {
                // Si eligen 4, muestra desde 4.0 hasta 4.99
                return $item->puntuacion_final >= $starsValue && $item->puntuacion_final < ($starsValue + 1);
            });
        }

        // 5. Ordenar por los mejores puntuados dentro del rango
        $resultados = $resultados->sortByDesc('puntuacion_final')->values();

        return Inertia::render('Explorar', [
            'resultados' => $resultados,
            'filtros' => $request->only(['search', 'city', 'stars'])
        ]);
    }
}