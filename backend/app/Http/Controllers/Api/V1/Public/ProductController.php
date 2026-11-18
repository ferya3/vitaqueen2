<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $category = $request->string('category')->limit(100)->toString();
        $size = $request->string('size')->toString();

        $data = PublicCache::remember("products:{$category}:{$size}", function () use ($request, $category, $size) {
            $products = Product::query()->active()
                ->with(['category', 'primaryImage'])
                ->when($category !== '', fn ($q) => $q->whereHas('category', fn ($c) => $c->where('slug', $category)))
                ->ordered()
                ->get()
                ->when(in_array($size, ['small', 'medium', 'large'], true), fn ($c) => $c->filter(
                    fn (Product $p) => $p->sizeClass() === $size
                ))
                ->values();

            return ProductResource::collection($products)->resolve($request);
        });

        return response()->json(['data' => $data]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $data = PublicCache::remember('product:'.md5($slug), function () use ($request, $slug) {
            $product = Product::query()->active()->where('slug', $slug)
                ->with(['category', 'images', 'primaryImage'])->first();

            if (! $product) {
                return null;
            }

            $related = Product::query()->active()->whereKeyNot($product->id)
                ->when($product->category_id, fn ($q) => $q->where('category_id', $product->category_id))
                ->with(['category', 'primaryImage'])->ordered()->limit(4)->get();

            return [
                'product' => (new ProductResource($product))->resolve($request),
                'related' => ProductResource::collection($related)->resolve($request),
            ];
        });

        abort_if($data === null, 404, 'Product not found.');

        return response()->json(['data' => $data['product'], 'related' => $data['related']]);
    }
}
