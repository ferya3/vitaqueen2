<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use Illuminate\Validation\Rule;

class CategoryRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('name', ! $this->isMethod('PATCH'), 100),
            Translatable::rules('description', false, 2000),
            [
                'slug' => [$this->requiredOnCreate(), 'string', 'max:100', 'regex:/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u',
                    Rule::unique('categories', 'slug')->ignore($this->currentId())],
                'sort_order' => ['integer', 'min:0'],
                'is_active' => ['boolean'],
            ],
        );
    }
}
