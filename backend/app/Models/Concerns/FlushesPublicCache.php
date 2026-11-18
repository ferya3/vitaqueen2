<?php

namespace App\Models\Concerns;

use App\Support\PublicCache;

/**
 * Invalidates cached public API responses whenever the model changes.
 */
trait FlushesPublicCache
{
    public static function bootFlushesPublicCache(): void
    {
        static::saved(fn () => PublicCache::flush());
        static::deleted(fn () => PublicCache::flush());
    }
}
