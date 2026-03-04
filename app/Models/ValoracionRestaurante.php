<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValoracionRestaurante extends Model
{
    // 1. Aseguramos el nombre de la tabla (con guion bajo como sale en tu error)
    protected $table = 'valoracion_restaurantes'; 

    protected $fillable = [
        'restaurante_id',
        'puntuacion',
        'comentario'
    ];

    // 2. ESTO ES LO QUE ARREGLA EL ERROR ACTUAL
    public $timestamps = false; 
    public function user()
{
    // Esto le dice: "Busca en la tabla users al dueño de esta valoración"
    return $this->belongsTo(User::class);
}
}