<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        // Si vas a tener roles (admin/cliente), deberías añadir 'role' aquí después
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- NUEVAS RELACIONES PARA EL PROYECTO RAME ---

    /**
     * Un usuario puede tener muchos mensajes de contacto
     */
    public function contactos()
    {
        return $this->hasMany(Contacto::class, 'user_id');
    }

    /**
     * Un usuario puede hacer muchas valoraciones de restaurantes
     */
    public function valoracionesRestaurantes()
    {
        return $this->hasMany(ValoracionRestaurante::class, 'user_id');
    }

    /**
     * Un usuario puede hacer muchas valoraciones de lugares
     */
    public function valoracionesLugares()
    {
        return $this->hasMany(ValoracionLugar::class, 'user_id');
    }
    public function isAdmin()
{
    return $this->role === 'admin';
}
}