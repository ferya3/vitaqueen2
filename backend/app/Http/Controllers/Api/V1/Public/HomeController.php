<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CertificateResource;
use App\Http\Resources\ProductionStepResource;
use App\Http\Resources\ProductResource;
use App\Models\Article;
use App\Models\Certificate;
use App\Models\Product;
use App\Models\ProductionStep;
use App\Services\SettingService;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Aggregated payload for the home page, so the frontend renders it with a single request.
 */
class HomeController extends Controller
{
    public function __invoke(Request $request, SettingService $settings): JsonResponse
    {
        $data = PublicCache::remember('home', function () use ($request, $settings) {
            $products = Product::query()->active()->where('is_featured', true)
                ->with(['category', 'primaryImage'])->ordered()->limit(8)->get();

            $articles = Article::query()->published()->latest('published_at')->limit(3)->get();

            return [
                'settings' => $settings->publicSettings(),
                'products' => ProductResource::collection($products)->resolve($request),
                'production_steps' => ProductionStepResource::collection(
                    ProductionStep::query()->active()->ordered()->get()
                )->resolve($request),
                'certificates' => CertificateResource::collection(
                    Certificate::query()->active()->where('type', '!=', 'lab_report')->ordered()->limit(6)->get()
                )->resolve($request),
                'articles' => ArticleResource::summaries($articles, $request),
            ];
        });

        return response()->json(['data' => $data]);
    }
}
