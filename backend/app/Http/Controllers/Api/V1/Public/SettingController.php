<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\SettingService;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function __invoke(SettingService $settings): JsonResponse
    {
        return response()->json(['data' => $settings->publicSettings()]);
    }
}
