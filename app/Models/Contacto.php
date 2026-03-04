<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;

    // Esto permite que el controlador guarde los datos del formulario
    protected $fillable = [
        'nombre',
        'telefono',
        'correo',
        'mensaje',
    ];
}