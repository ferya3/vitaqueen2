<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'name' => $this->t('name'),
            'short_description' => $this->t('short_description'),
            'description' => $this->t('description'),
            'volume_ml' => $this->volume_ml,
            'size_class' => $this->sizeClass(),
            'bottle_material' => $this->bottle_material,
            'units_per_pack' => $this->units_per_pack,
            'packs_per_pallet' => $this->packs_per_pallet,
            'shelf_life_months' => $this->shelf_life_months,
            'ph' => $this->ph !== null ? (float) $this->ph : null,
            'tds' => $this->tds,
            'mineral_composition' => $this->mineral_composition ?? [],
            'specs' => $admin ? ($this->specs ?? []) : $this->localizedSpecs(),
            'barcode' => $this->barcode,
            'accent_color' => $this->accent_color,
            'is_featured' => $this->is_featured,
            'is_active' => $this->when($admin, $this->is_active),
            'sort_order' => $this->when($admin, $this->sort_order),
            'category_id' => $this->when($admin, $this->category_id),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'image' => $this->whenLoaded('primaryImage', fn () => $this->primaryImage ? new ProductImageResource($this->primaryImage) : null),
            'images' => ProductImageResource::collection($this->whenLoaded('images')),
            'meta_title' => $this->t('meta_title'),
            'meta_description' => $this->t('meta_description'),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /** @return list<array{label: ?string, value: ?string}> */
    private function localizedSpecs(): array
    {
        $locale = app()->getLocale();
        $pick = fn ($v) => is_array($v) ? ($v[$locale] ?? collect($v)->first(fn ($x) => filled($x))) : $v;

        return collect($this->specs ?? [])
            ->map(fn ($spec) => ['label' => $pick($spec['label'] ?? null), 'value' => $pick($spec['value'] ?? null)])
            ->filter(fn ($spec) => filled($spec['label']) && filled($spec['value']))
            ->values()
            ->all();
    }
}
