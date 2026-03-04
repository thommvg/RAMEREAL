<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ValoracionRestaurante extends Model
{
    use HasFactory;

    // 1. Nombre exacto de la tabla
    protected $table = 'valoracion_restaurantes'; 

    // 2. Agregamos 'user_id' para que no falle al guardar
    protected $fillable = [
        'restaurante_id',
        'user_id',       // <--- IMPORTANTE: Agrégalo aquí
        'puntuacion',
        'comentario'
    ];

    // 3. ¡IMPORTANTE! Quitamos el $timestamps = false 
    // porque en la migración sí los creamos. 

    /**
     * Relación: Una valoración pertenece a un restaurante
     */
    public function restaurante()
    {
        return $this->belongsTo(Restaurante::class, 'restaurante_id');
    }

    /**
     * Relación: Una valoración pertenece a un usuario
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}