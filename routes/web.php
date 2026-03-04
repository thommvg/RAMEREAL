<?php

use App\Http\Controllers\SearchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ContactoController; // 👈 ESTA ES LA QUE FALTA
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth; // 👈 IMPORTANTE para el logout
use Inertia\Inertia;
use App\Http\Controllers\ValoracionController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Rutas de envío de datos
Route::post('/dashboard/store', [DashboardController::class, 'store'])->name('dashboard.store');
Route::post('/contactos', [ContactoController::class, 'store'])->name('contactos.store');
Route::post('/valoraciones', [ValoracionController::class, 'store'])->name('valoraciones.store');

// Rutas de navegación
Route::get('/explorar', [SearchController::class, 'index'])->name('explorar');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::get('/lugares', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('acerca-de');

// Perfil de usuario
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Logout corregido
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();

    return redirect()->route('welcome'); // 👈 Es mejor usar el nombre de la ruta
})->middleware('auth')->name('logout');

require __DIR__.'/auth.php';