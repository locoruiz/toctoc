<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('phone')->unique();
            $table->string('role')->default('Customer');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('codes', function (Blueprint $table) {
            $table->id();
            $table->string('phone');
            $table->integer('code');
            $table->dateTime('expira', $precision = 0);
        });

        DB::table('users')->insert(
            [array(
                'name' => 'Matias Martinez',
                'phone' => '+59176001136',
                'role' => 'Admin'
            ),
            array(
                'name' => 'Ricardo Ruiz',
                'phone' => '+59167390698',
                'role' => 'Admin'
            )
            ]
        );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('codes');
        Schema::dropIfExists('users');
    }
}
