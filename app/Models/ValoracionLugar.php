<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ValoracionLugar extends Model
{
    // Asegúrate de que este sea el nombre real de tu tabla en phpMyAdmin
    protected $table = 'valoracion_lugares'; 

    protected $fillable = [
        'lugares_id',
        'puntuacion',
        'comentario'
    ];

    // Relación: Una valoración pertenece a un lugar
    public function lugar()
    {
        return $this->belongsTo(Lugar::class, 'lugares_id');
    }
    public function user()
{
    // Esto le dice: "Busca en la tabla users al dueño de esta valoración"
    return $this->belongsTo(User::class);
}
}