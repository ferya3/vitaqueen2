<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;

class ProductionLineRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('name', ! $this->isMethod('PATCH'), 150),
            Translatable::rules('description', false, 5000),
            Translatable::rules('technology', false, 1000),
            [
                'capacity_per_hour' => ['nullable', 'integer', 'min:0', 'max:1000000'],
                'bottle_sizes' => ['nullable', 'array', 'max:20'],
                'bottle_sizes.*' => ['integer', 'min:50', 'max:30000'],
                'image_path' => ['nullable', 'string', 'max:500'],
                'is_active' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
        );
    }
}
