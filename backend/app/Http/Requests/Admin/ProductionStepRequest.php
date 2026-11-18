<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use Illuminate\Validation\Rule;

class ProductionStepRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('title', ! $this->isMethod('PATCH'), 150),
            Translatable::rules('description', false, 3000),
            [
                'key' => [$this->requiredOnCreate(), 'string', 'max:50', 'alpha_dash',
                    Rule::unique('production_steps', 'key')->ignore($this->currentId())],
                'icon' => ['nullable', 'string', 'max:50'],
                'image_path' => ['nullable', 'string', 'max:500'],
                'is_active' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
        );
    }
}
