<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('type', 20)->default('news')->index()->comment('news | article');
            $table->json('title');
            $table->json('excerpt')->nullable();
            $table->json('body')->nullable();
            $table->string('cover_path')->nullable();
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->boolean('is_published')->default(false)->index();
            $table->timestamp('published_at')->nullable()->index();
            $table->unsignedInteger('views')->default(0);
            $table->json('meta_title')->nullable();
            $table->json('meta_description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
