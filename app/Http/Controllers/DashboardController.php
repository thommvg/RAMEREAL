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
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    /**
     * Muestra la vista principal con el Top 3 y el Mapa unificado.
     */
    public function index()
    {
        // 1. Lugares mejor puntuados (excluyendo tipo 1 si es necesario)
        $lugares = Lugar::withAvg('valoraciones', 'puntuacion')
            ->where('tipo_de_turismo_id', '!=', 1)
            ->orderByDesc('valoraciones_avg_puntuacion')
            ->take(3)
            ->get();

        // 2. Restaurantes mejor puntuados
        $restaurantes = Restaurante::withAvg('valoraciones', 'puntuacion')
            ->orderByDesc('valoraciones_avg_puntuacion')
            ->take(3)
            ->get();

        // 3. Preparar datos para el Mapa (Lugares)
        $lugaresMapa = Lugar::whereNotNull('lat')
            ->whereNotNull('lng')
            ->get()
            ->map(function ($lugar) {
                $lugar->tipo_entidad = 'lugar';
                return $lugar;
            });

        // 4. Preparar datos para el Mapa (Restaurantes)
        $restaurantesMapa = Restaurante::whereNotNull('lat')
            ->whereNotNull('lng')
            ->get()
            ->map(function ($restaurante) {
                $restaurante->tipo_entidad = 'restaurante';
                return $restaurante;
            });

        // Combinamos ambas colecciones para el mapa de React
        $mapaCompleto = $lugaresMapa->concat($restaurantesMapa)->values();

        return Inertia::render('Dashboard', [
            'lugares' => $lugares,
            'restaurantes' => $restaurantes,
            'lugaresMapa' => $mapaCompleto
        ]);
    }

    /**
     * Registra un nuevo establecimiento y crea su primera valoración.
     */
    public function store(Request $request)
    {
        // Validación con tus mensajes personalizados
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

        // 🔥 PROCESO DE GEOCODIFICACIÓN (Obtener lat/lng de la dirección)
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

        // ID del usuario logueado para la auditoría y dashboard
        $userId = Auth::id();

        if ($request->tipo_entidad === 'lugar') {
            // Crear el Lugar físico
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

            // Crear la Valoración vinculada al usuario
            ValoracionLugar::create([
                'lugares_id' => $nuevo->id,
                'user_id'    => $userId,
                'puntuacion' => $request->puntuacion,
                'comentario' => $request->comentario,
            ]);

        } else {
            // Crear el Restaurante físico
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

            // Crear la Valoración vinculada al usuario
            ValoracionRestaurante::create([
                'restaurante_id' => $nuevo->id,
                'user_id'        => $userId,
                'puntuacion'     => $request->puntuacion,
                'comentario'     => $request->comentario,
            ]);
        }

        return redirect()->back()->with('success', '¡Registro creado correctamente en Rame!');
    }

    /**
     * Guarda mensajes de contacto y los vincula al perfil si el usuario está activo.
     */
    public function contactoStore(Request $request)
    {
        $data = $request->validate([
            'nombre' => 'required|string|max:100',
            'telefono' => 'required|string',
            'correo' => 'required|email',
            'mensaje' => 'required|string',
        ]);

        // Si hay sesión iniciada, registramos el ID del usuario automáticamente
        if (Auth::check()) {
            $data['user_id'] = Auth::id();
        }

        Contacto::create($data);

        return redirect()->back()->with('success', 'Mensaje enviado correctamente');
    }
}