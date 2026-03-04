<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\ValoracionLugar;
use App\Models\Ciudad;

class Lugar extends Model 
{
    protected $table = 'lugares'; 

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

    // --- AÑADE ESTO (CRÍTICO) ---
    // Evita el error "Unknown column 'created_at'" al guardar
    public $timestamps = false; 

    // Relación con valoraciones
    public function valoraciones()
    {
        // Usamos 'lugares_id' sin espacios, como está en tu base de datos
        return $this->hasMany(ValoracionLugar::class, 'lugares_id');
    }

}