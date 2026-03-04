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
        Schema::create('lugares', function (Blueprint $table) {
                    $table->id();
        $table->string('nombre');
        $table->text('descripcion');
        $table->string('direccion');
        $table->unsignedBigInteger('tipo_de_turismo_id');
        $table->string('ciudad', 100)->nullable(); // Texto simple en lugar de ID
        $table->LONGTEXT('imagen')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lugares');
    }
};
