<?php

namespace App\Http\Requests;

use App\Support\Locales;

/**
 * Validation rules for {fa, en, ar} translated fields. The default locale is
 * required when the field is required; other locales are always optional.
 */
final class Translatable
{
    /**
     * @param  list<string>  $extra  extra rules applied to every locale value
     * @return array<string, list<string>>
     */
    public static function rules(string $field, bool $required = false, int $max = 255, array $extra = []): array
    {
        $rules = [$field => [$required ? 'required' : 'nullable', 'array']];

        foreach (Locales::supported() as $i => $locale) {
            $rules["{$field}.{$locale}"] = array_merge(
                [$required && $i === 0 ? 'required' : 'nullable', 'string', "max:{$max}"],
                $extra,
            );
        }

        return $rules;
    }

    /** @param list<string> $fields */
    public static function many(array $fields, bool $required = false, int $max = 255): array
    {
        return array_merge(...array_map(fn ($f) => self::rules($f, $required, $max), $fields));
    }
}
