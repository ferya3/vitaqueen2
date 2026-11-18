<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class UserController extends CrudController
{
    protected string $model = User::class;

    protected string $resource = UserResource::class;

    protected string $request = UserRequest::class;

    protected array $searchable = ['name', 'email'];

    protected array $filterable = ['role', 'is_active'];

    protected array $sortable = ['id', 'name', 'last_login_at', 'created_at'];

    protected string $defaultSort = 'id';

    protected function prepare(array $data, ?Model $model = null): array
    {
        if (empty($data['password'])) {
            unset($data['password']);
        }

        if ($model && $model->is(auth()->user())) {
            // Guard against locking yourself out.
            if (array_key_exists('is_active', $data) && ! $data['is_active']) {
                throw ValidationException::withMessages(['is_active' => 'You cannot deactivate your own account.']);
            }
            if (isset($data['role']) && $data['role'] !== $model->role->value) {
                throw ValidationException::withMessages(['role' => 'You cannot change your own role.']);
            }
        }

        return $data;
    }

    protected function afterSave(Model $model, array $data): void
    {
        // Revoke sessions when an account is deactivated or its password changes.
        if ((isset($data['is_active']) && ! $data['is_active']) || isset($data['password'])) {
            if (! $model->is(auth()->user())) {
                $model->tokens()->delete();
            }
        }
    }

    public function destroy(int|string $id): JsonResponse
    {
        if ((string) $id === (string) auth()->id()) {
            abort(422, 'You cannot delete your own account.');
        }

        return parent::destroy($id);
    }
}
