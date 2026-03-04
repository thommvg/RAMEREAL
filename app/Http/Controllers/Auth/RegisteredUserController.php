<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Log; // Para que \Log no marque error

// 👇 ESTAS DOS LÍNEAS SON CLAVE PARA EL CORREO
use App\Mail\BienvenidaUsuarioMail;
use Illuminate\Support\Facades\Mail;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[^\s]+$/',
            ],

            'email' => [
                'required',
                'string',
                'email:rfc,dns',
                'max:255',
                'unique:users,email',   
                'regex:/^[^\s@]+@(gmail|hotmail)\.com$/',
            ],

            'password' => [
                'required',
                'confirmed',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s><\'"&\\\\])[^\s]+$/',
            ],
        ], [
            'name.regex' => 'El nombre no puede contener espacios.',
            'email.regex' => 'El correo no puede contener espacios y debe ser Gmail o Hotmail terminado en .com.',
            'password.regex' => 'La contraseña no puede contener espacios y debe tener mayúscula, minúscula, número y símbolo.',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        // 📧 MANDAMOS EL CORREO ANTES DE CERRAR SESIÓN
        try {
            Mail::to($user->email)->send(new BienvenidaUsuarioMail($user));
        } catch (\Exception $e) {
            // Si hay un error, lo guarda en storage/logs/laravel.log
            \Log::error("Error enviando correo de bienvenida: " . $e->getMessage());
        }

        // 🔒 MANTENEMOS TU LÓGICA DE CIERRE DE SESIÓN
        auth()->logout();
        session()->invalidate();
        session()->regenerateToken();

        return redirect()->route('welcome')->with('status', 'Registro exitoso. Por favor, inicia sesión.');
    }
}