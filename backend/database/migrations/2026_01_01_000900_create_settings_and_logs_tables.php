<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('group', 50)->default('general')->index();
            $table->string('key', 100)->unique();
            $table->json('value')->nullable();
            $table->boolean('is_public')->default(true)->comment('Exposed through the public API');
            $table->timestamps();
        });

        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 50)->index();
            $table->nullableMorphs('subject');
            $table->string('description')->nullable();
            $table->json('properties')->nullable();
            $table->ipAddress('ip')->nullable();
            $table->timestamp('created_at')->useCurrent()->index();
        });

        // Daily aggregated page views (privacy friendly: no IPs / cookies stored).
        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('path', 255);
            $table->unsignedInteger('views')->default(0);
            $table->unique(['date', 'path']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('settings');
    }
};
