<?php

namespace App\Http\Requests\Admin;

use App\Enums\Role;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserRequest extends AdminRequest
{
    public function rules(): array
    {
        $req = $this->requiredOnCreate();

        return [
            'name' => [$req, 'string', 'max:100'],
            'email' => [$req, 'email:rfc', 'max:150', Rule::unique('users', 'email')->ignore($this->currentId())],
            'password' => [$this->isUpdate() ? 'nullable' : 'required', 'string', Password::min(10)->letters()->numbers()],
            'role' => [$req, Rule::enum(Role::class)],
            'is_active' => ['boolean'],
        ];
    }
}
