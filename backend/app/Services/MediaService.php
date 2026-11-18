<?php

namespace App\Services;

use App\Models\Media;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MediaService
{
    public function store(UploadedFile $file, string $collection = 'general', ?User $user = null, ?array $alt = null): Media
    {
        $disk = 'public';
        $extension = strtolower($file->guessExtension() ?: $file->getClientOriginalExtension());
        $directory = $collection.'/'.now()->format('Y/m');
        $name = Str::ulid()->toBase32().'.'.$extension;

        $path = $file->storeAs($directory, strtolower($name), $disk);

        [$width, $height] = $this->dimensions($file);

        return Media::create([
            'disk' => $disk,
            'path' => $path,
            'original_name' => Str::limit($file->getClientOriginalName(), 250, ''),
            'mime_type' => $file->getMimeType() ?? 'application/octet-stream',
            'size' => $file->getSize(),
            'width' => $width,
            'height' => $height,
            'alt' => $alt,
            'collection' => $collection,
            'uploaded_by' => $user?->id,
        ]);
    }

    public function delete(Media $media): void
    {
        Storage::disk($media->disk)->delete($media->path);
        $media->delete();
    }

    /** @return array{0: ?int, 1: ?int} */
    private function dimensions(UploadedFile $file): array
    {
        if (! str_starts_with((string) $file->getMimeType(), 'image/')) {
            return [null, null];
        }

        $size = @getimagesize($file->getRealPath());

        return $size ? [$size[0], $size[1]] : [null, null];
    }
}
