<?php

namespace App\Http\Controllers;

use App\Models\Lugar;
use App\Models\Restaurante;
use App\Models\User;
use App\Models\Contacto;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function index()
    {
        // Totales para las tarjetas de la entrada
        $totalUsuarios = User::where('role', 'user')->count();
        $totalLugares = Lugar::count();
        $totalRestaurantes = Restaurante::count();
        $totalMensajes = Contacto::count();
        $totalAdmins = User::where('role', 'admin')->count();

        return Inertia::render('DashboardReal', [
            'stats' => [
                'usuarios'     => $totalUsuarios,
                'lugares'      => $totalLugares,
                'restaurantes' => $totalRestaurantes,
                'mensajes'     => $totalMensajes,
                'admins'       => $totalAdmins,
            ],

            // MÉTRICAS ESPECÍFICAS PARA CADA COMPONENTE (Aquí es donde querés las estadísticas)
            'lugares_metrics' => [
                'total'     => $totalLugares,
                'medellin'  => Lugar::where('ciudad', 'LIKE', '%Medellín%')->count(),
                'populares' => DB::table('valoracion_lugares')->where('puntuacion', 5)->distinct('lugares_id')->count(),
            ],
            'restaurantes_metrics' => [
                'total'     => $totalRestaurantes,
                'itaguí'    => Restaurante::where('ciudad', 'LIKE', '%Itagüí%')->count(),
                'top_rated' => DB::table('valoracion_restaurantes')->where('puntuacion', '>=', 4)->distinct('restaurante_id')->count(),
            ],
            'mensajes_metrics' => [
                'total'     => $totalMensajes,
                'hoy'       => Contacto::whereDate('created_at', today())->count(),
                'recientes' => Contacto::where('created_at', '>=', now()->subDays(3))->count(),
            ],
            'usuarios_metrics' => [
                'total'   => $totalUsuarios,
                'activos' => User::whereNotNull('email_verified_at')->count(),
                'nuevos'  => User::where('created_at', '>=', now()->subDays(30))->count(),
            ],

            // LISTADOS COMPLETOS PARA LAS TABLAS
            'lugares'        => Lugar::latest()->get(),
            'restaurantes'   => Restaurante::latest()->get(),
            'usuarios_lista' => User::where('role', 'user')->latest()->get(),
            'admins_lista'   => User::where('role', 'admin')->latest()->get(),
            'mensajes_lista' => Contacto::latest()->get(),
        ]);
    }

    public function storeAdmin(Request $request) {
        $request->validate(['name' => 'required', 'email' => 'required|unique:users', 'password' => 'required|min:8']);
        User::create(['name' => $request->name, 'email' => $request->email, 'password' => Hash::make($request->password), 'role' => 'admin']);
        return redirect()->back();
    }

    public function toggleAdminStatus($id) {
        $user = User::findOrFail($id);
        if ($user->id !== Auth::id()) {
            $user->role = ($user->role === 'admin') ? 'user' : 'admin';
            $user->save();
        }
        return redirect()->back();
    }

    public function updateProfile(Request $request) {
        $user = Auth::user();
        $user->update($request->only('name', 'email'));
        if ($request->password) { $user->update(['password' => Hash::make($request->password)]); }
        return redirect()->back();
    }

    public function destroyLugar($id) { Lugar::findOrFail($id)->delete(); return redirect()->back(); }
    public function destroyRestaurante($id) { Restaurante::findOrFail($id)->delete(); return redirect()->back(); }
    public function destroyMensaje($id) { Contacto::findOrFail($id)->delete(); return redirect()->back(); }
    public function destroyUser($id) { 
        $user = User::findOrFail($id);
        if ($user->id !== Auth::id()) { $user->delete(); }
        return redirect()->back();
    }
}