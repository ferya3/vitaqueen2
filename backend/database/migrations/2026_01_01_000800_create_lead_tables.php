<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('representatives', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('company_name')->nullable();
            $table->string('phone', 32);
            $table->string('email')->nullable();
            $table->string('country', 64)->default('IR');
            $table->string('province', 64);
            $table->string('city', 64);
            $table->string('activity_type', 32)->comment('distributor | wholesaler | retailer | exporter | organization');
            $table->string('distribution_capacity', 64)->nullable();
            $table->boolean('has_warehouse')->default(false);
            $table->unsignedSmallInteger('vehicle_count')->nullable();
            $table->text('message')->nullable();
            $table->string('status', 20)->default('new')->index()->comment('new | reviewing | contacted | approved | rejected');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $table->text('admin_notes')->nullable();
            $table->string('locale', 5)->default('fa');
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();
            $table->index(['province', 'created_at']);
        });

        Schema::create('contact_requests', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('phone', 32)->nullable();
            $table->string('email')->nullable();
            $table->string('request_type', 32)->default('general')->comment('general | wholesale | export | organization | complaint');
            $table->string('subject')->nullable();
            $table->text('message');
            $table->string('status', 20)->default('new')->index()->comment('new | read | answered | archived');
            $table->text('admin_notes')->nullable();
            $table->string('locale', 5)->default('fa');
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_requests');
        Schema::dropIfExists('representatives');
    }
};
