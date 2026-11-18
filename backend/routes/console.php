<?php

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Schedule;

// Housekeeping (run by the "scheduler" container: php artisan schedule:work)
Schedule::command('sanctum:prune-expired --hours=24')->daily();
Schedule::command('queue:prune-failed --hours=168')->daily();
Schedule::call(fn () => ActivityLog::query()->where('created_at', '<', now()->subYear())->delete())
    ->weekly()->name('prune-activity-logs');
