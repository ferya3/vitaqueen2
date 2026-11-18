<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Product> */
class ProductFactory extends Factory
{
    public function definition(): array
    {
        $volume = fake()->randomElement([330, 500, 1500, 10000]);

        return [
            'slug' => 'water-'.$volume.'-'.fake()->unique()->numberBetween(1, 99999),
            'name' => ['fa' => "آب معدنی {$volume}", 'en' => "Mineral water {$volume} ml"],
            'short_description' => ['fa' => 'توضیح کوتاه', 'en' => 'Short description'],
            'volume_ml' => $volume,
            'bottle_material' => 'PET',
            'units_per_pack' => 12,
            'is_featured' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
