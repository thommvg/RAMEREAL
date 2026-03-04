<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;

    // 1. Agregamos 'user_id' al fillable para que Laravel permita guardarlo
    protected $fillable = [
        'user_id',    // <--- IMPORTANTE: Añade esto
        'nombre',
        'telefono',
        'correo',
        'mensaje',
    ];

    /**
     * 2. Relación con el Usuario
     * Esto te permitirá hacer en el Dashboard: $contacto->usuario->name
     */
    public function usuario()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}