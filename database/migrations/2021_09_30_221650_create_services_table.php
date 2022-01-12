<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('tipo');
            $table->string('tipoCasa');
            $table->string('tipoProfunda')->nullable();
            $table->double('horas', 14, 2);
            $table->double('precio', 15, 2);
            $table->double('horasCompartidas', 14, 2);
            $table->integer('profesionales');
            $table->integer('cuartos');
            $table->integer('banos');
            $table->integer('horasPlanchado');
            $table->integer('referencia'); // 1 hasta el quinto anillo, 2 hasta el octavo, 3 fuera del octavo, 4 urubo
            $table->json('opcionales');
            $table->json('materialesExtras');
            $table->date('fecha');
            $table->json('hora');
            
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->unsignedBigInteger('direction_id');
            $table->foreign('direction_id')->references('id')->on('directions');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('services');
    }
}
