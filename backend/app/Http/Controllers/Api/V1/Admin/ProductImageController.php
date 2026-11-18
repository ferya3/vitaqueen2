<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Translatable;
use App\Http\Resources\ProductImageResource;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductImage;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProductImageController extends Controller
{
    /**
     * Attach an image: either upload a new file or reference an existing media item.
     */
    public function store(Request $request, Product $product, MediaService $media): JsonResponse
    {
        Gate::authorize('update', $product);

        $cfg = config('aqua.uploads');
        $data = $request->validate(array_merge(Translatable::rules('alt', false, 200), [
            'file' => ['required_without:media_id', 'file', 'mimes:'.implode(',', $cfg['image_mimes']), 'max:'.$cfg['max_image_kb']],
            'media_id' => ['required_without:file', 'integer', 'exists:media,id'],
            'is_primary' => ['boolean'],
        ]));

        $item = isset($data['file'])
            ? $media->store($data['file'], 'products', $request->user(), $data['alt'] ?? null)
            : Media::findOrFail($data['media_id']);

        abort_unless($item->isImage(), 422, 'Selected media is not an image.');

        $image = DB::transaction(function () use ($product, $item, $data) {
            $primary = ($data['is_primary'] ?? false) || ! $product->images()->exists();
            if ($primary) {
                $product->images()->update(['is_primary' => false]);
            }

            return $product->images()->create([
                'media_id' => $item->id,
                'path' => $item->path,
                'alt' => $data['alt'] ?? $item->alt,
                'is_primary' => $primary,
                'sort_order' => (int) $product->images()->max('sort_order') + 1,
            ]);
        });

        return (new ProductImageResource($image))->response()->setStatusCode(201);
    }

    public function update(Request $request, Product $product, ProductImage $image): ProductImageResource
    {
        Gate::authorize('update', $product);
        abort_unless($image->product_id === $product->id, 404);

        $data = $request->validate(array_merge(Translatable::rules('alt', false, 200), [
            'is_primary' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]));

        DB::transaction(function () use ($product, $image, $data) {
            if ($data['is_primary'] ?? false) {
                $product->images()->whereKeyNot($image->id)->update(['is_primary' => false]);
            }
            $image->update($data);
        });

        return new ProductImageResource($image->fresh());
    }

    public function destroy(Product $product, ProductImage $image): JsonResponse
    {
        Gate::authorize('update', $product);
        abort_unless($image->product_id === $product->id, 404);

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $product->images()->orderBy('sort_order')->first()?->update(['is_primary' => true]);
        }

        return response()->json(null, 204);
    }
}
