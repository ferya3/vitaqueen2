<?php

namespace App\Support;

final class Localize
{
    /**
     * Recursively replace translation objects ({fa, en, ar}) inside a structure
     * with the string for the given locale (falls back to the default locale).
     */
    public static function deep(mixed $value, ?string $locale = null): mixed
    {
        if (! is_array($value)) {
            return $value;
        }

        $locales = Locales::supported();
        $keys = array_keys($value);

        if ($keys !== [] && array_diff($keys, $locales) === []) {
            $locale ??= app()->getLocale();

            return filled($value[$locale] ?? null) ? $value[$locale] : ($value[$locales[0]] ?? null);
        }

        return array_map(fn ($v) => self::deep($v, $locale), $value);
    }
}
