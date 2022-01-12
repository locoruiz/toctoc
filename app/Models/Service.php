<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'tipo',
        'tipoCasa',
        'tipoProfunda',
        'horas',
        'precio',
        'horasCompartidas',
        'profesionales',
        'cuartos',
        'banos',
        'horasPlanchado',
        'referencia', // 1 hasta el quinto anillo, 2 hasta el octavo, 3 fuera del octavo, 4 urubo
        'opcionales',
        'materialesExtras',
        'fecha',
        'hora',
        'user_id',
        'direction_id'
    ];

    /**
     * Get the user that requested the service
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the direction
     */
    public function direction()
    {
        return $this->belongsTo(Direction::class);
    }
}
