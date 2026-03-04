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
        $table->string('nombre');
        $table->string('telefono');
        $table->string('correo');
        $table->text('mensaje');
        $table->timestamps(); // Aquí sí dejamos los tiempos para saber cuándo escribieron
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
