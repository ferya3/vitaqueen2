<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MediaUploadRequest;
use App\Http\Requests\Translatable;
use App\Http\Resources\MediaResource;
use App\Models\Media;
use App\Services\MediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class MediaController extends Controller
{
    public function __construct(private readonly MediaService $media) {}

    public function index(Request $request): ResourceCollection
    {
        Gate::authorize('viewAny', Media::class);

        $type = $request->query('type');
        $search = trim((string) $request->query('search', ''));

        $items = Media::query()->with('uploader')
            ->when($request->query('collection'), fn ($q, $c) => $q->where('collection', $c))
            ->when($type === 'image', fn ($q) => $q->where('mime_type', 'like', 'image/%'))
            ->when($type === 'document', fn ($q) => $q->where('mime_type', 'application/pdf'))
            ->when($type === 'video', fn ($q) => $q->where('mime_type', 'like', 'video/%'))
            ->when($search !== '', fn ($q) => $q->whereRaw('LOWER(original_name) LIKE ?', ['%'.mb_strtolower($search).'%']))
            ->latest('id')
            ->paginate(min(100, max(1, (int) $request->query('per_page', 30))));

        return MediaResource::collection($items);
    }

    public function store(MediaUploadRequest $request): JsonResponse
    {
        Gate::authorize('create', Media::class);

        $item = $this->media->store(
            $request->file('file'),
            $request->input('collection', 'general'),
            $request->user(),
            $request->input('alt'),
        );

        return (new MediaResource($item))->response()->setStatusCode(201);
    }

    public function update(Request $request, Media $media): MediaResource
    {
        Gate::authorize('update', $media);

        $media->update($request->validate(array_merge(Translatable::rules('alt', false, 200), [
            'collection' => ['sometimes', 'string', 'max:50', 'alpha_dash'],
        ])));

        return new MediaResource($media);
    }

    public function destroy(Media $media): JsonResponse
    {
        Gate::authorize('delete', $media);

        $this->media->delete($media);

        return response()->json(null, 204);
    }
}
