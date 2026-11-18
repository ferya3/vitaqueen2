<?php

namespace App\Support;

use App\Jobs\RevalidateFrontend;
use Closure;
use Illuminate\Support\Facades\Cache;

/**
 * Versioned cache for public API responses.
 *
 * Every key is prefixed with a global "content version". Any change to public
 * content bumps the version, which instantly invalidates every cached response
 * without needing cache tags (works with redis, database, file and array stores).
 */
final class PublicCache
{
    private const VERSION_KEY = 'public-content:version';

    public static function remember(string $key, Closure $callback, ?int $ttl = null): mixed
    {
        $ttl ??= (int) config('aqua.public_cache_ttl', 3600);

        if ($ttl <= 0) {
            return $callback();
        }

        // Store plain JSON-compatible arrays: nested API resources are objects until
        // serialized, and the cache store refuses to unserialize arbitrary classes.
        return Cache::remember(self::key($key), $ttl, fn () => self::plain($callback()));
    }

    public static function flush(): void
    {
        Cache::forever(self::VERSION_KEY, self::version() + 1);

        if (filled(config('aqua.revalidate.url'))) {
            RevalidateFrontend::dispatch()->afterCommit();
        }
    }

    public static function version(): int
    {
        return (int) Cache::get(self::VERSION_KEY, 1);
    }

    private static function plain(mixed $value): mixed
    {
        return $value === null || is_scalar($value) ? $value : json_decode(json_encode($value), true);
    }

    private static function key(string $key): string
    {
        return 'public:v'.self::version().':'.app()->getLocale().':'.$key;
    }
}
