<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20)->default('certificate')->index()->comment('certificate | lab_report | standard');
            $table->json('title');
            $table->json('issuer')->nullable();
            $table->json('description')->nullable();
            $table->string('certificate_number', 100)->nullable();
            $table->date('issued_at')->nullable();
            $table->date('expires_at')->nullable();
            $table->string('image_path')->nullable();
            $table->string('file_path')->nullable()->comment('Downloadable PDF');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
