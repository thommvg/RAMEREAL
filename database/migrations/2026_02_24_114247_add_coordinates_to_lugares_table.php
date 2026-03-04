<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lugares', function (Blueprint $table) {

            if (!Schema::hasColumn('lugares', 'lat')) {
                $table->decimal('lat', 10, 7)->nullable();
            }

            if (!Schema::hasColumn('lugares', 'lng')) {
                $table->decimal('lng', 10, 7)->nullable();
            }

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lugares', function (Blueprint $table) {

            if (Schema::hasColumn('lugares', 'lat')) {
                $table->dropColumn('lat');
            }

            if (Schema::hasColumn('lugares', 'lng')) {
                $table->dropColumn('lng');
            }

        });
    }
};