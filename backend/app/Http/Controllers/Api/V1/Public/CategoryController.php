<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $data = PublicCache::remember('categories', fn () => CategoryResource::collection(
            Category::query()->active()->ordered()
                ->withCount(['products' => fn ($q) => $q->where('is_active', true)])->get()
        )->resolve($request));

        return response()->json(['data' => $data]);
    }
}
