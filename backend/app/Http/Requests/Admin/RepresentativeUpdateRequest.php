<?php

namespace App\Http\Requests\Admin;

use App\Models\Representative;
use Illuminate\Validation\Rule;

class RepresentativeUpdateRequest extends AdminRequest
{
    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::in(Representative::STATUSES)],
            'assigned_to' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'admin_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}
