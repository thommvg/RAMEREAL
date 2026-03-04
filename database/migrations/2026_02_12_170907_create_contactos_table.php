<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('contactos', function (Blueprint $table) {
        $table->id();
        
        // Relación opcional con el usuario
        // nullable() permite que personas no registradas también contacten
        $table->foreignId('user_id')
              ->nullable()
              ->constrained('users')
              ->onDelete('set null'); 

        $table->string('nombre');
        $table->string('telefono');
        $table->string('correo');
        $table->text('mensaje');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contactos');
    }
};
