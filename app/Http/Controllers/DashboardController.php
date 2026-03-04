<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Lugar;
use App\Models\Restaurante;
use App\Models\ValoracionLugar;
use App\Models\ValoracionRestaurante;
use App\Models\Contacto;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function index()
    {
        // Lugares mejor puntuados
        $lugares = Lugar::withAvg('valoraciones', 'puntuacion')
            ->where('tipo_de_turismo_id', '!=', 1)
            ->orderByDesc('valoraciones_avg_puntuacion')
            ->take(3)
            ->get();

        // Restaurantes mejor puntuados
        $restaurantes = Restaurante::withAvg('valoraciones', 'puntuacion')
            ->orderByDesc('valoraciones_avg_puntuacion')
            ->take(3)
            ->get();

        // 🔥 Lugares con coordenadas válidas
        $lugaresMapa = Lugar::whereNotNull('lat')
            ->whereNotNull('lng')
            ->get()
            ->map(function ($lugar) {
                $lugar->tipo_entidad = 'lugar';
                return $lugar;
            });

        // 🔥 Restaurantes con coordenadas válidas
        $restaurantesMapa = Restaurante::whereNotNull('lat')
            ->whereNotNull('lng')
            ->get()
            ->map(function ($restaurante) {
                $restaurante->tipo_entidad = 'restaurante';
                return $restaurante;
            });

        // 🔥 Unimos todo
        $lugaresMapa = $lugaresMapa->concat($restaurantesMapa)->values();

        return Inertia::render('Dashboard', [
            'lugares' => $lugares,
            'restaurantes' => $restaurantes,
            'lugaresMapa' => $lugaresMapa
        ]);
    }

    public function store(Request $request)
    {
        // Validación
        $request->validate([
            'nombre' => 'required|string|max:100',
            'direccion' => 'required|string|max:255',
            'ciudad' => 'required|string|max:100',
            'comentario' => 'required|string|min:10',
            'puntuacion' => 'required|integer|min:1|max:5',
            'imagen' => 'required|string',
            'tipo_entidad' => 'required|in:lugar,restaurante',
        ], [
            'required' => 'Este campo es obligatorio.',
            'string'   => 'Valor inválido.',
            'max'      => 'Demasiado largo.',
            'min'      => 'Muy corto.',
            'integer'  => 'Debe ser número.',
            'in'       => 'Tipo inválido.',
        ]);

        // 🔥 GEOCODIFICACIÓN CON NOMINATIM (CORREGIDA)
        $direccionCompleta = $request->direccion . ', ' . $request->ciudad . ', Colombia';

        $response = Http::withHeaders([
            'User-Agent' => 'RameProject/1.0 (contacto@rame.com)'
        ])->get('https://nominatim.openstreetmap.org/search', [
            'q' => $direccionCompleta,
            'format' => 'json',
            'limit' => 1
        ]);

        $latitud = null;
        $longitud = null;

        if ($response->successful() && count($response->json()) > 0) {
            $data = $response->json()[0];
            $latitud = $data['lat'];
            $longitud = $data['lon'];
        }

        // Guardar Lugar
        if ($request->tipo_entidad === 'lugar') {

            $nuevo = Lugar::create([
                'nombre' => $request->nombre,
                'direccion' => $request->direccion,
                'ciudad' => $request->ciudad,
                'tipo_de_turismo_id' => $request->tipo_de_turismo_id ?? 1,
                'descripcion' => $request->comentario,
                'imagen' => $request->imagen,
                'lat' => $latitud,
                'lng' => $longitud,
            ]);

            ValoracionLugar::create([
                'lugares_id' => $nuevo->id,
                'puntuacion' => $request->puntuacion,
                'comentario' => $request->comentario,
            ]);

        }
        // Guardar Restaurante
        else {

            $nuevo = Restaurante::create([
                'nombre' => $request->nombre,
                'direccion' => $request->direccion,
                'ciudad' => $request->ciudad,
                'descripcion' => $request->comentario,
                'imagen' => $request->imagen,
                'tipo_de_comida_id' => $request->tipo_de_comida_id ?? 1,
                'lat' => $latitud,
                'lng' => $longitud,
            ]);

            ValoracionRestaurante::create([
                'restaurante_id' => $nuevo->id,
                'puntuacion' => $request->puntuacion,
                'comentario' => $request->comentario,
            ]);
        }

        return redirect()->back()->with('success', '¡Registro creado correctamente!');
    }

    public function contactoStore(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'telefono' => 'required|string',
            'correo' => 'required|email',
            'mensaje' => 'required|string',
        ]);

        Contacto::create($data);

        return redirect()->back()->with('success', 'Mensaje enviado correctamente');
    }
}