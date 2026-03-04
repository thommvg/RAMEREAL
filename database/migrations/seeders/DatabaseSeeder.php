<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash; // Importante para la contraseña

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Creamos tu usuario Administrador
        User::create([
            'name' => 'Mario Norbey',
            'email' => 'marionorbeyhenao8@gmail.com', // Tu correo real
            'password' => Hash::make('Marionorbey8$'), // Cambia esto por una clave que recuerdes
            'role' => 'admin', // <--- ESTO ES LO QUE TE DA EL PODER
        ]);

        // 2. Si tienes otros Seeders (como el de Lugares), llámalos aquí:
        // $this->call(LugarSeeder::class);
        
        echo "Base de datos reiniciada: Admin creado correctamente. \n";
    }
}