<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Authorization is handled by policies inside the controllers.
 */
abstract class AdminRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** Id of the model being updated (first route parameter), null on create. */
    protected function currentId(): int|string|null
    {
        $value = collect($this->route()?->parameters() ?? [])->first();

        return is_object($value) ? $value->getKey() : $value;
    }

    protected function isUpdate(): bool
    {
        return $this->isMethod('PUT') || $this->isMethod('PATCH');
    }

    /** "required" on create, "sometimes" on partial update. */
    protected function requiredOnCreate(): string
    {
        return $this->isMethod('PATCH') ? 'sometimes' : 'required';
    }
}
