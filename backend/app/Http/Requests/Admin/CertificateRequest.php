<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;
use App\Models\Certificate;
use Illuminate\Validation\Rule;

class CertificateRequest extends AdminRequest
{
    public function rules(): array
    {
        return array_merge(
            Translatable::rules('title', ! $this->isMethod('PATCH'), 200),
            Translatable::rules('issuer', false, 200),
            Translatable::rules('description', false, 5000),
            [
                'type' => [$this->requiredOnCreate(), Rule::in(Certificate::TYPES)],
                'certificate_number' => ['nullable', 'string', 'max:100'],
                'issued_at' => ['nullable', 'date'],
                'expires_at' => ['nullable', 'date', 'after_or_equal:issued_at'],
                'image_path' => ['nullable', 'string', 'max:500'],
                'file_path' => ['nullable', 'string', 'max:500'],
                'is_active' => ['boolean'],
                'sort_order' => ['integer', 'min:0'],
            ],
        );
    }
}
