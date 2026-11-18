<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

/**
 * Base policy: maps a resource name (e.g. "products") to role abilities defined in
 * config/aqua.php. Read actions accept the read-only "<resource>.view" ability.
 */
abstract class ResourcePolicy
{
    protected string $resource;

    public function viewAny(User $user): bool
    {
        return $user->hasAbility($this->resource, write: false);
    }

    public function view(User $user, Model $model): bool
    {
        return $user->hasAbility($this->resource, write: false);
    }

    public function create(User $user): bool
    {
        return $user->hasAbility($this->resource);
    }

    public function update(User $user, Model $model): bool
    {
        return $user->hasAbility($this->resource);
    }

    public function delete(User $user, Model $model): bool
    {
        return $user->hasAbility($this->resource);
    }
}
