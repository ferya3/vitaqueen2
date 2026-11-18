<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class MediaResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => $this->url(),
            'path' => $this->path,
            'original_name' => $this->original_name,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'width' => $this->width,
            'height' => $this->height,
            'alt' => $this->alt,
            'collection' => $this->collection,
            'is_image' => $this->isImage(),
            'uploaded_by' => $this->whenLoaded('uploader', fn () => $this->uploader?->name),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
