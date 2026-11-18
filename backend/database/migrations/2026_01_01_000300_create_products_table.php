<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('slug')->unique();
            $table->string('sku', 64)->nullable()->unique();
            $table->json('name');
            $table->json('short_description')->nullable();
            $table->json('description')->nullable();
            $table->unsignedInteger('volume_ml');
            $table->string('bottle_material', 32)->default('PET');
            $table->unsignedSmallInteger('units_per_pack')->nullable();
            $table->unsignedSmallInteger('packs_per_pallet')->nullable();
            $table->unsignedSmallInteger('shelf_life_months')->nullable();
            $table->decimal('ph', 4, 2)->nullable();
            $table->unsignedInteger('tds')->nullable()->comment('Total dissolved solids, mg/L');
            $table->json('mineral_composition')->nullable()->comment('[{key, value, unit}]');
            $table->json('specs')->nullable()->comment('[{label:{fa,en,ar}, value:{fa,en,ar}}]');
            $table->string('barcode', 32)->nullable();
            $table->string('accent_color', 9)->nullable()->comment('Tint used by the 3D bottle / card');
            $table->boolean('is_featured')->default(false)->index();
            $table->boolean('is_active')->default(true)->index();
            $table->unsignedInteger('sort_order')->default(0);
            $table->json('meta_title')->nullable();
            $table->json('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_id')->nullable()->constrained('media')->nullOnDelete();
            $table->string('path');
            $table->json('alt')->nullable();
            $table->boolean('is_primary')->default(false);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
        Schema::dropIfExists('products');
    }
};
