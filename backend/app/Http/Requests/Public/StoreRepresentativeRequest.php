<?php

namespace App\Http\Requests\Public;

use App\Models\Representative;
use Illuminate\Validation\Rule;

class StoreRepresentativeRequest extends PublicFormRequest
{
    protected array $numericLike = ['phone', 'vehicle_count'];

    public function rules(): array
    {
        return array_merge($this->spamRules(), [
            'full_name' => ['required', 'string', 'min:3', 'max:100'],
            'company_name' => ['nullable', 'string', 'max:150'],
            'phone' => ['required', 'string', $this->phoneRule()],
            'email' => ['nullable', 'email:rfc', 'max:150'],
            'country' => ['nullable', 'string', 'max:64'],
            'province' => ['required', 'string', 'max:64'],
            'city' => ['required', 'string', 'max:64'],
            'activity_type' => ['required', Rule::in(Representative::ACTIVITY_TYPES)],
            'distribution_capacity' => ['nullable', 'string', 'max:64'],
            'has_warehouse' => ['nullable', 'boolean'],
            'vehicle_count' => ['nullable', 'integer', 'min:0', 'max:10000'],
            'message' => ['nullable', 'string', 'max:3000'],
        ]);
    }

    public function attributes(): array
    {
        return [
            'full_name' => __('fields.full_name'),
            'phone' => __('fields.phone'),
            'province' => __('fields.province'),
            'city' => __('fields.city'),
            'activity_type' => __('fields.activity_type'),
        ];
    }
}
