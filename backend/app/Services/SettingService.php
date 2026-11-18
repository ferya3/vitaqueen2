<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductionLine;
use App\Models\Setting;
use App\Support\Localize;
use App\Support\PublicCache;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class SettingService
{
    /**
     * Public settings as a nested array (dot keys expanded), localized.
     */
    public function publicSettings(): array
    {
        return PublicCache::remember('settings', function () {
            $flat = Setting::query()->where('is_public', true)->pluck('value', 'key')->all();

            $settings = Localize::deep(Arr::undot($flat));
            $settings['stats'] = $this->resolveStats($settings['stats'] ?? []);

            return $settings;
        });
    }

    /**
     * Fill "auto" stats from live counts and drop placeholders / empty values so
     * the website never shows invented numbers.
     */
    private function resolveStats(array $stats): array
    {
        $live = [
            'products' => fn () => Product::query()->where('is_active', true)->count(),
            'production_lines' => fn () => ProductionLine::query()->where('is_active', true)->count(),
        ];

        return collect($stats)
            ->map(function ($stat) use ($live) {
                if (($stat['auto'] ?? false) && isset($live[$stat['key'] ?? ''])) {
                    $stat['value'] = $live[$stat['key']]();
                }

                return $stat;
            })
            ->filter(fn ($stat) => ! ($stat['is_placeholder'] ?? false) && (float) ($stat['value'] ?? 0) > 0)
            ->map(fn ($stat) => Arr::only($stat, ['key', 'value', 'suffix', 'label']))
            ->values()
            ->all();
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return Setting::query()->where('key', $key)->value('value') ?? $default;
    }

    /**
     * @param  list<array{key: string, value: mixed, group?: ?string, is_public?: ?bool}>  $items
     */
    public function updateMany(array $items): void
    {
        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                $setting = Setting::firstOrNew(['key' => $item['key']]);
                $setting->value = $item['value'];
                $setting->group = $item['group'] ?? $setting->group ?? explode('.', $item['key'])[0];
                if (array_key_exists('is_public', $item) && $item['is_public'] !== null) {
                    $setting->is_public = $item['is_public'];
                }
                $setting->save();
            }
        });
    }
}
