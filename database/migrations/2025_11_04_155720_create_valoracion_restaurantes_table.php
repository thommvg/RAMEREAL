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
            // Se cambió 'Restaurantes' por 'restaurantes' (en minúsculas)
            $table->foreignId('restaurante_id')
                  ->constrained('restaurantes') 
                  ->onDelete('cascade');

            $table->integer('puntuacion');
            $table->text('comentario')->nullable();
            $table->timestamps(); // Es recomendable agregar timestamps
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