<?php

namespace App\Models\Concerns;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;

/**
 * Records create / update / delete events performed by authenticated admins.
 */
trait LogsActivity
{
    public static function bootLogsActivity(): void
    {
        static::created(fn (Model $model) => ActivityLog::record('created', $model));

        static::updated(function (Model $model) {
            $changes = array_keys($model->getChanges());
            $changes = array_values(array_diff($changes, ['updated_at', 'password', 'remember_token']));
            if ($changes !== []) {
                ActivityLog::record('updated', $model, ['changed' => $changes]);
            }
        });

        static::deleted(fn (Model $model) => ActivityLog::record('deleted', $model));
    }
}
