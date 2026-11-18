<?php

namespace App\Models;

use App\Enums\Role;
use App\Models\Concerns\LogsActivity;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, LogsActivity, Notifiable;

    protected $fillable = ['name', 'email', 'password', 'role', 'is_active'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'role' => Role::class,
        ];
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === Role::SuperAdmin;
    }

    /**
     * Abilities granted by the user's role (see config/aqua.php).
     *
     * @return list<string>
     */
    public function abilities(): array
    {
        return $this->role?->abilities() ?? [];
    }

    /**
     * "products" grants full management; "products.view" grants read-only access.
     */
    public function hasAbility(string $resource, bool $write = true): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $abilities = $this->abilities();

        if (in_array('*', $abilities, true) || in_array($resource, $abilities, true)) {
            return true;
        }

        return ! $write && in_array($resource.'.view', $abilities, true);
    }
}
