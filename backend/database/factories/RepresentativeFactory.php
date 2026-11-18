<?php

namespace Database\Factories;

use App\Models\Representative;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Representative> */
class RepresentativeFactory extends Factory
{
    public function definition(): array
    {
        return [
            'full_name' => fake()->name(),
            'phone' => '0912'.fake()->numerify('#######'),
            'province' => fake()->randomElement(['تهران', 'اصفهان', 'فارس', 'خراسان رضوی']),
            'city' => fake()->city(),
            'activity_type' => fake()->randomElement(Representative::ACTIVITY_TYPES),
            'status' => 'new',
        ];
    }
}
