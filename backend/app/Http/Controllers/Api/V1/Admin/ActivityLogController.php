<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

class ActivityLogController extends Controller
{
    public function index(Request $request): ResourceCollection
    {
        Gate::authorize('viewAny', ActivityLog::class);

        $logs = ActivityLog::query()->with('user')
            ->when($request->query('user_id'), fn ($q, $id) => $q->where('user_id', $id))
            ->when($request->query('action'), fn ($q, $a) => $q->where('action', $a))
            ->latest('id')
            ->paginate(min(100, max(1, (int) $request->query('per_page', 30))));

        return ActivityLogResource::collection($logs);
    }
}
