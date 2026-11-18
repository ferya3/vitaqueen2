<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Shared helpers for API resources.
 *
 * - Public API: translatable attributes are returned as a single string in the
 *   request locale.
 * - Admin API (routes named "admin.*"): the full {fa, en, ar} object is returned
 *   so editors can manage every translation.
 */
abstract class BaseResource extends JsonResource
{
    public static $wrap = 'data';

    protected function isAdmin(?Request $request = null): bool
    {
        $request ??= request();

        return Str::startsWith((string) $request->route()?->getName(), 'admin.');
    }

    /** Translated attribute (string) or all translations (admin). */
    protected function t(string $attribute): mixed
    {
        return $this->isAdmin() ? $this->resource->getAttribute($attribute) : $this->resource->translate($attribute);
    }

    /**
     * Absolute URL for a stored path. Absolute URLs and root-relative paths
     * (e.g. "/images/x.webp" served by the frontend) are returned unchanged.
     */
    protected function fileUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '/'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }
}
