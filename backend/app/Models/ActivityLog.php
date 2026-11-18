<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ActivityLog extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['user_id', 'action', 'subject_type', 'subject_id', 'description', 'properties', 'ip'];

    protected $casts = ['properties' => 'array'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Record an admin action. Silently skipped for guests (public form submissions,
     * seeders, console) unless explicitly forced.
     */
    public static function record(string $action, ?Model $subject = null, array $properties = [], bool $force = false): ?self
    {
        $user = auth()->user();

        if (! $user && ! $force) {
            return null;
        }

        return static::create([
            'user_id' => $user?->getKey(),
            'action' => $action,
            'subject_type' => $subject?->getMorphClass(),
            'subject_id' => $subject?->getKey(),
            'description' => $subject ? class_basename($subject).' #'.$subject->getKey() : null,
            'properties' => $properties ?: null,
            'ip' => request()?->ip(),
        ]);
    }
}
