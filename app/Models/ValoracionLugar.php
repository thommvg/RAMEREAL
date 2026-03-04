<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ValoracionLugar extends Model
{
    use HasFactory;

    protected $table = 'valoracion_lugares'; 

    protected $fillable = [
        'lugares_id',
        'user_id',      // <--- ¡OJO! Debes añadir esto para poder guardar quién califica
        'puntuacion',
        'comentario'
    ];

    // Relación: Una valoración pertenece a un lugar
    public function lugar()
    {
        return $this->belongsTo(Lugar::class, 'lugares_id');
    }

    // Relación: Una valoración pertenece a un usuario
    public function usuario()
    {
        // Especificamos 'user_id' por seguridad para que coincida con tu migración
        return $this->belongsTo(User::class, 'user_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}