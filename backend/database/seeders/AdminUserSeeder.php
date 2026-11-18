<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => strtolower(env('ADMIN_EMAIL', 'admin@example.com'))],
            [
                'name' => env('ADMIN_NAME', 'Super Admin'),
                'password' => env('ADMIN_PASSWORD', 'ChangeMe!2026'),
                'role' => Role::SuperAdmin,
                'is_active' => true,
            ],
        );
    }
}
