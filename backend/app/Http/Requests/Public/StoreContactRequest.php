<?php

namespace App\Http\Requests\Public;

use App\Models\ContactRequest;
use Illuminate\Validation\Rule;

class StoreContactRequest extends PublicFormRequest
{
    public function rules(): array
    {
        return array_merge($this->spamRules(), [
            'name' => ['required', 'string', 'min:2', 'max:100'],
            'phone' => ['required_without:email', 'nullable', 'string', $this->phoneRule()],
            'email' => ['required_without:phone', 'nullable', 'email:rfc', 'max:150'],
            'request_type' => ['nullable', Rule::in(ContactRequest::REQUEST_TYPES)],
            'subject' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:5000'],
        ]);
    }

    public function attributes(): array
    {
        return [
            'name' => __('fields.full_name'),
            'phone' => __('fields.phone'),
            'email' => __('fields.email'),
            'message' => __('fields.message'),
        ];
    }
}
