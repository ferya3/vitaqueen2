<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Models\Setting;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        Gate::authorize('viewAny', Setting::class);

        return response()->json([
            'data' => Setting::query()->orderBy('group')->orderBy('key')
                ->get(['id', 'group', 'key', 'value', 'is_public', 'updated_at']),
        ]);
    }

    public function update(SettingsUpdateRequest $request, SettingService $settings): JsonResponse
    {
        Gate::authorize('create', Setting::class);

        $settings->updateMany($request->validated('settings'));

        return $this->index();
    }
}
