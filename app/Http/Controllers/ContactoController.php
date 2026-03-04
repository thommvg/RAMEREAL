<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contacto;
use Illuminate\Support\Facades\Redirect;

class ContactoController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre'   => 'required|string|max:255',
            'telefono' => 'required',
            'correo'   => 'required|email',
            'mensaje'  => 'required',
        ]);

        Contacto::create($request->all());

        return Redirect::back()->with('success', '¡Mensaje guardado!');
    }
}