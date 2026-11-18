<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Only super admins manage users (granted through Gate::before). Nobody may delete
 * or deactivate their own account — enforced in UserController as Gate::before
 * short-circuits policies for super admins.
 */
class UserPolicy extends ResourcePolicy
{
    protected string $resource = 'users';

    public function delete(User $user, Model $model): bool
    {
        return $user->hasAbility($this->resource) && ! $user->is($model);
    }
}
