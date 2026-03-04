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
    Schema::create('valoracion_restaurantes', function (Blueprint $table) {
        $table->id(); // Siempre es bueno tener un ID propio de la valoración
        
        // Relación con el restaurante (Ya la tienes bien)
        $table->foreignId('restaurante_id')
              ->constrained('restaurantes') 
              ->onDelete('cascade');

        // ¡ESTA ES LA QUE FALTA! Relación con el usuario
        $table->foreignId('user_id')
              ->constrained('users')
              ->onDelete('cascade');

        $table->integer('puntuacion'); // Ej: del 1 al 5
        $table->text('comentario')->nullable();
        $table->timestamps(); 
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoracion_restaurantes');
    }
};