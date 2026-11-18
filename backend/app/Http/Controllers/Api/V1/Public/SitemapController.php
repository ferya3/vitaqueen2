<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Product;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;

/**
 * Slugs + last modification dates consumed by the frontend sitemap.xml generator.
 */
class SitemapController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $data = PublicCache::remember('sitemap', fn () => [
            'products' => Product::query()->active()->ordered()->get(['slug', 'updated_at'])
                ->map(fn ($p) => ['slug' => $p->slug, 'updated_at' => $p->updated_at?->toIso8601String()])->all(),
            'articles' => Article::query()->published()->latest('published_at')->get(['slug', 'updated_at'])
                ->map(fn ($a) => ['slug' => $a->slug, 'updated_at' => $a->updated_at?->toIso8601String()])->all(),
        ]);

        return response()->json(['data' => $data]);
    }
}
