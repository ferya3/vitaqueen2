<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_lines', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('description')->nullable();
            $table->unsignedInteger('capacity_per_hour')->nullable()->comment('Bottles per hour');
            $table->json('bottle_sizes')->nullable()->comment('Array of volumes in ml');
            $table->json('technology')->nullable();
            $table->string('image_path')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        // Ordered steps used by the scroll-storytelling "production process" section.
        Schema::create('production_steps', function (Blueprint $table) {
            $table->id();
            $table->string('key', 50)->unique();
            $table->json('title');
            $table->json('description')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('image_path')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_steps');
        Schema::dropIfExists('production_lines');
    }
};
