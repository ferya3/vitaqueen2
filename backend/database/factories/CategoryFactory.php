<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Category> */
class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'slug' => str($name)->slug()->toString(),
            'name' => ['fa' => 'دسته '.$name, 'en' => ucfirst($name)],
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => true,
        ];
    }
}
