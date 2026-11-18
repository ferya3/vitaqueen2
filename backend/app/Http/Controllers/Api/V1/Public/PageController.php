<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\PageResource;
use App\Models\Page;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function show(Request $request, string $slug): JsonResponse
    {
        $data = PublicCache::remember('page:'.md5($slug), function () use ($request, $slug) {
            $page = Page::query()->where('is_published', true)->where('slug', $slug)->first();

            return $page ? (new PageResource($page))->resolve($request) : null;
        });

        abort_if($data === null, 404, 'Page not found.');

        return response()->json(['data' => $data]);
    }
}
