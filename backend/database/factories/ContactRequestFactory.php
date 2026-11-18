<?php

namespace Database\Factories;

use App\Models\ContactRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ContactRequest> */
class ContactRequestFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'request_type' => 'general',
            'message' => fake()->paragraph(),
            'status' => 'new',
        ];
    }
}
