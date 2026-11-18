<?php

namespace App\Http\Requests\Admin;

use App\Models\ContactRequest;
use Illuminate\Validation\Rule;

class ContactRequestUpdateRequest extends AdminRequest
{
    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::in(ContactRequest::STATUSES)],
            'admin_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}
