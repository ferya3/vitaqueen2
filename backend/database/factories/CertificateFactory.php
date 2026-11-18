<?php

namespace Database\Factories;

use App\Models\Certificate;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Certificate> */
class CertificateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'type' => 'certificate',
            'title' => ['fa' => 'گواهینامه', 'en' => 'Certificate '.fake()->word()],
            'issued_at' => now()->subYear(),
            'expires_at' => now()->addYear(),
            'is_active' => true,
        ];
    }
}
