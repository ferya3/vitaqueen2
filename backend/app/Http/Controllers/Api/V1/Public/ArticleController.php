<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $type = in_array($request->query('type'), ['news', 'article'], true) ? $request->query('type') : null;
        $page = max(1, (int) $request->query('page', 1));
        $perPage = min(24, max(1, (int) $request->query('per_page', 9)));

        $data = PublicCache::remember("articles:{$type}:{$page}:{$perPage}", function () use ($request, $type, $perPage, $page) {
            $paginator = Article::query()->published()
                ->when($type, fn ($q) => $q->where('type', $type))
                ->latest('published_at')
                ->paginate($perPage, ['*'], 'page', $page);

            return [
                'data' => ArticleResource::summaries($paginator->getCollection(), $request),
                'meta' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ];
        }, 600);

        return response()->json($data);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $data = PublicCache::remember('article:'.md5($slug), function () use ($request, $slug) {
            $article = Article::query()->published()->where('slug', $slug)->with('author')->first();

            if (! $article) {
                return null;
            }

            $related = ArticleResource::summaries(
                Article::query()->published()->whereKeyNot($article->id)
                    ->where('type', $article->type)->latest('published_at')->limit(3)->get(),
                $request,
            );

            return ['article' => (new ArticleResource($article))->resolve($request), 'related' => $related];
        });

        abort_if($data === null, 404, 'Article not found.');

        return response()->json(['data' => $data['article'], 'related' => $data['related']]);
    }
}
