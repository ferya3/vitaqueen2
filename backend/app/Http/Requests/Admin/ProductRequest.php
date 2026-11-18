<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use Illuminate\Validation\Rule;

class ProductRequest extends AdminRequest
{
    public function rules(): array
    {
        $req = $this->requiredOnCreate();
        $full = ! $this->isMethod('PATCH');

        return array_merge(
            Translatable::rules('name', $full, 150),
            Translatable::rules('short_description', false, 500),
            Translatable::rules('description', false, 20000),
            Translatable::rules('meta_title', false, 70),
            Translatable::rules('meta_description', false, 170),
            [
                'category_id' => ['nullable', 'integer', 'exists:categories,id'],
                'slug' => [$req, 'string', 'max:120', 'regex:/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u',
                    Rule::unique('products', 'slug')->ignore($this->currentId())],
                'sku' => ['nullable', 'string', 'max:64', Rule::unique('products', 'sku')->ignore($this->currentId())],
                'volume_ml' => [$req, 'integer', 'min:50', 'max:30000'],
                'bottle_material' => ['nullable', 'string', Rule::in(['PET', 'Glass', 'PC', 'Can'])],
                'units_per_pack' => ['nullable', 'integer', 'min:1', 'max:1000'],
                'packs_per_pallet' => ['nullable', 'integer', 'min:1', 'max:10000'],
                'shelf_life_months' => ['nullable', 'integer', 'min:1', 'max:60'],
                'ph' => ['nullable', 'numeric', 'between:0,14'],
                'tds' => ['nullable', 'integer', 'min:0', 'max:5000'],
                'mineral_composition' => ['nullable', 'array', 'max:30'],
                'mineral_composition.*.key' => ['required', 'string', 'max:40'],
                'mineral_composition.*.value' => ['required', 'numeric', 'min:0'],
                'mineral_composition.*.unit' => ['nullable', 'string', 'max:16'],
                'specs' => ['nullable', 'array', 'max:40'],
                'specs.*.label' => ['required', 'array'],
                'specs.*.label.*' => ['nullable', 'string', 'max:100'],
                'specs.*.value' => ['required', 'array'],
                'specs.*.value.*' => ['nullable', 'string', 'max:200'],
                'barcode' => ['nullable', 'string', 'max:32'],
                'accent_color' => ['nullable', 'regex:/^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/'],
                'is_featured' => ['boolean'],
                'is_active' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
        );
    }
}
