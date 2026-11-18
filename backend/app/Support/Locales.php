<?php

namespace App\Support;

use Illuminate\Http\Request;

final class Locales
{
    /** @return list<string> */
    public static function supported(): array
    {
        return config('aqua.locales') ?: ['fa'];
    }

    public static function default(): string
    {
        return self::supported()[0];
    }

    public static function isSupported(?string $locale): bool
    {
        return $locale !== null && in_array($locale, self::supported(), true);
    }

    public static function isRtl(string $locale): bool
    {
        return in_array($locale, ['fa', 'ar'], true);
    }

    /**
     * Resolve the content locale from ?locale=, then Accept-Language, then default.
     */
    public static function fromRequest(Request $request): string
    {
        $query = $request->query('locale');
        if (is_string($query) && self::isSupported($query)) {
            return $query;
        }

        $preferred = $request->getPreferredLanguage(self::supported());

        return self::isSupported($preferred) ? $preferred : self::default();
    }
}
