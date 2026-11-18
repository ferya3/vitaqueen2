<?php

namespace Database\Factories;

use App\Models\Article;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Article> */
class ArticleFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->sentence(4);

        return [
            'slug' => str($title)->slug()->toString(),
            'type' => 'news',
            'title' => ['fa' => 'خبر '.$title, 'en' => $title],
            'excerpt' => ['fa' => 'خلاصه', 'en' => 'Excerpt'],
            'body' => ['fa' => '<p>متن</p>', 'en' => '<p>Body</p>'],
            'is_published' => true,
            'published_at' => now()->subDay(),
        ];
    }

    public function draft(): static
    {
        return $this->state(fn () => ['is_published' => false, 'published_at' => null]);
    }
}
