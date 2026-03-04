<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    
public function run(): void
{
    \App\Models\User::create([
        'name' => 'Admin Rame',
        'email' => 'marionorbeyhenao8@gmail.com', // Cambia esto por tu correo
        'password' => bcrypt('Marionorbey8$'), // Cambia esto por una clave segura
        'role' => 'admin',
    ]);
}
}
