<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contacto;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia; // Lo necesitaremos para el Dashboard

class ContactoController extends Controller
{
    /**
     * Esta es la función que usarás en tu Dashboard
     */
    public function index()
    {
        // Traemos los contactos "con" sus usuarios para el Dashboard
        $contactos = Contacto::with('usuario')->latest()->get();

        return Inertia::render('Admin/Contactos', [
            'contactos' => $contactos
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nombre'   => 'required|string|max:255',
            'telefono' => 'required',
            'correo'   => 'required|email',
            'mensaje'  => 'required',
        ]);

        // --- EL CAMBIO CLAVE ---
        // Si el usuario está autenticado, le pegamos su ID al mensaje
        if (auth()->check()) {
            $data['user_id'] = auth()->id();
        }

        Contacto::create($data);

        return Redirect::back()->with('success', '¡Mensaje guardado!');
    }
}