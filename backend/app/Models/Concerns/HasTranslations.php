<?php

namespace App\Models\Concerns;

use App\Support\Locales;

/**
 * Stores translatable attributes as JSON objects: {"fa": "...", "en": "...", "ar": "..."}.
 *
 * Models declare `protected array $translatable = ['name', ...]`.
 */
trait HasTranslations
{
    public function initializeHasTranslations(): void
    {
        $this->mergeCasts(array_fill_keys($this->getTranslatableAttributes(), 'array'));
    }

    /** @return list<string> */
    public function getTranslatableAttributes(): array
    {
        return property_exists($this, 'translatable') ? $this->translatable : [];
    }

    /**
     * Value in the requested locale, falling back to the default locale and
     * then to the first non-empty translation.
     */
    public function translate(string $attribute, ?string $locale = null): ?string
    {
        $values = $this->getAttribute($attribute);

        if (! is_array($values)) {
            return $values === null ? null : (string) $values;
        }

        $locale ??= app()->getLocale();

        foreach ([$locale, Locales::default()] as $candidate) {
            if (filled($values[$candidate] ?? null)) {
                return $values[$candidate];
            }
        }

        foreach ($values as $value) {
            if (filled($value)) {
                return $value;
            }
        }

        return null;
    }
}
