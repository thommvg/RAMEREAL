<?php

namespace App\Http\Controllers;

// 1. IMPORTACIONES (No olvides ninguna, son vitales)
use App\Models\Lugar;
use App\Models\Restaurante;
use App\Models\User;
use App\Models\Contacto;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /**
     * Carga todos los datos reales para el Dashboard
     */
    public function index()
    {
        return Inertia::render('DashboardReal', [
            'stats' => [
                'usuarios'     => User::where('role', 'user')->count(),
                'lugares'      => Lugar::count(),
                'restaurantes' => Restaurante::count(),
                'mensajes'     => Contacto::count(),
                'admins'       => User::where('role', 'admin')->count(),
            ],
            'lugares'        => Lugar::latest()->get(),
            'restaurantes'   => Restaurante::latest()->get(),
            'usuarios_lista' => User::where('role', 'user')->latest()->get(),
            'admins_lista'   => User::where('role', 'admin')->latest()->get(),
            'mensajes_lista' => Contacto::latest()->get(),
        ]);
    }

    /**
     * Actualiza el perfil del administrador actual
     */
    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|min:8',
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->back()->with('message', 'Perfil actualizado con éxito');
    }

    /**
     * MÉTODOS DE ELIMINACIÓN (Uno por cada modelo)
     */
    public function destroyLugar($id)
    {
        Lugar::findOrFail($id)->delete();
        return redirect()->back();
    }

    public function destroyRestaurante($id)
    {
        Restaurante::findOrFail($id)->delete();
        return redirect()->back();
    }

    public function destroyMensaje($id)
    {
        Contacto::findOrFail($id)->delete();
        return redirect()->back();
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        // Evitar suicidio digital (no borrarse a sí mismo)
        if ($user->id !== Auth::id()) {
            $user->delete();
        }
        return redirect()->back();
    }
    // ... dentro de la clase AdminController

public function storeAdmin(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:8',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'role' => 'admin',
        'active' => true, // Asegúrate de tener esta columna o la manejamos con roles
    ]);

    return redirect()->back()->with('success', 'Admin creado.');
}

public function toggleAdminStatus($id)
{
    $user = User::findOrFail($id);
    
    // Evitar desactivarte a ti mismo
    if ($user->id === Auth::id()) {
        return redirect()->back()->with('error', 'No puedes desactivarte a ti mismo.');
    }

    // Si no tienes columna 'active', podemos simplemente cambiarle el rol a 'user'
    // Pero si tienes columna 'active', sería: $user->active = !$user->active;
    $user->role = ($user->role === 'admin') ? 'user' : 'admin';
    $user->save();

    return redirect()->back()->with('success', 'Estado actualizado.');
}
} // <--- ASEGÚRATE DE QUE ESTA LLAVE CIERRE TODO EL ARCHIVO