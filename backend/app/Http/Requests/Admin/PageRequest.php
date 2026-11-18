<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use App\Support\HtmlSanitizer;
use Illuminate\Validation\Rule;

class PageRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('title', ! $this->isMethod('PATCH'), 200),
            Translatable::rules('excerpt', false, 1000),
            Translatable::rules('body', false, 100000),
            Translatable::rules('meta_title', false, 70),
            Translatable::rules('meta_description', false, 170),
            [
                'slug' => [$this->requiredOnCreate(), 'string', 'max:100', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                    Rule::unique('pages', 'slug')->ignore($this->currentId())],
                'sections' => ['nullable', 'array', 'max:50'],
                'sections.*.type' => ['required', 'string', 'max:40'],
                'cover_path' => ['nullable', 'string', 'max:500'],
                'is_published' => ['boolean'],
            ],
        );
    }

    /** Rich-text HTML is sanitized before validation and storage. */
    protected function prepareForValidation(): void
    {
        if (is_array($this->input('body'))) {
            $this->merge(['body' => HtmlSanitizer::cleanTranslations($this->input('body'))]);
        }
    }
}
