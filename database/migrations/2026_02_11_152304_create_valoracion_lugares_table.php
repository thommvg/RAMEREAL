<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('valoracion_lugares', function (Blueprint $table) {
            $table->id();
            
            // 1. Relación con el Lugar Turístico
            // Asegúrate que la tabla se llame 'lugares' en su propia migración
            $table->foreignId('lugares_id')
                  ->constrained('lugares')
                  ->onDelete('cascade');

            // 2. Relación con el Usuario (¡Fundamental para el proyecto!)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // 3. Datos de la valoración
            $table->integer('puntuacion'); // Ej: de 1 a 5 estrellas
            $table->text('comentario')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoracion_lugares');
    }
};