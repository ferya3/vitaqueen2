<?php

namespace App\Http\Requests\Admin;

class SettingsUpdateRequest extends AdminRequest
{
    public function rules(): array
    {
        return [
            'settings' => ['required', 'array', 'max:100'],
            'settings.*.key' => ['required', 'string', 'max:100', 'regex:/^[a-z0-9_.]+$/'],
            'settings.*.value' => ['present'],
            'settings.*.group' => ['nullable', 'string', 'max:50', 'alpha_dash'],
            'settings.*.is_public' => ['nullable', 'boolean'],
        ];
    }
}
