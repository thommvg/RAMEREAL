<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurante extends Model
{
    protected $table = 'restaurantes';

    protected $fillable = [
        'nombre',
        'descripcion',
        'imagen',
        'direccion',
        'ciudad',
        // ESTA ES LA LÍNEA QUE TE FALTA PARA QUE FUNCIONE:
        'tipo_de_comida_id',
        'lat',
        'lng'
    ];

    // Esto está perfecto, evita errores si tu tabla no tiene created_at/updated_at
    public $timestamps = false; 

    public function valoraciones()
    {
        // Usamos el nombre en singular que confirmamos en tu explorador
        return $this->hasMany(ValoracionRestaurante::class, 'restaurante_id');
    }
}