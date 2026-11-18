<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use Illuminate\Validation\Rule;

class ArticleRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('title', ! $this->isMethod('PATCH'), 200),
            Translatable::rules('excerpt', false, 600),
            Translatable::rules('body', false, 100000),
            Translatable::rules('meta_title', false, 70),
            Translatable::rules('meta_description', false, 170),
            [
                'slug' => [$this->requiredOnCreate(), 'string', 'max:160', 'regex:/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u',
                    Rule::unique('articles', 'slug')->ignore($this->currentId())],
                'type' => ['nullable', Rule::in(['news', 'article'])],
                'cover_path' => ['nullable', 'string', 'max:500'],
                'is_published' => ['boolean'],
                'published_at' => ['nullable', 'date'],
            ],
        );
    }
}
