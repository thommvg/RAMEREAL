<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('valoracion_lugares', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('lugares_id'); // FK a lugares
            $table->integer('puntuacion');
            $table->text('comentario')->nullable();
            $table->timestamps();

            // Foreign key
            $table->foreign('lugares_id')
                  ->references('id')
                  ->on('lugares')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('valoracion_lugares');
    }
};
