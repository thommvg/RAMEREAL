<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class lugar extends Model
{
    protected $table = 'lugares'; // coincide con tu tabla

    protected $fillable = [
        'nombre',
        'descripcion',
        'direccion',
        'tipo_de_turismo_id',
        'ciudad',
        'imagen',
        'lat',
        'lng'
    ];

    // Relación con valoraciones
    public function valoraciones()
    {
        // Asegúrate que la FK en valoraciones es 'turismo_id'
        return $this->hasMany(ValoracionLugar::class, 'lugares_id');
    }

    public function tipoDeTurismo()
    {
        return $this->belongsTo(Tipo_de_turismo::class, 'tipo_de_turismo_id');
    }


}
