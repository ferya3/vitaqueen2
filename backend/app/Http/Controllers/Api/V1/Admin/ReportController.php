<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactRequest;
use App\Models\Representative;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __invoke(Request $request, AnalyticsService $analytics): JsonResponse
    {
        abort_unless($request->user()->hasAbility('reports', false), 403);

        $days = in_array((int) $request->query('days'), [7, 30, 90], true) ? (int) $request->query('days') : 30;

        return response()->json(['data' => [
            'days' => $days,
            'series' => $analytics->dailySeries($days),
            'top_pages' => $analytics->topPages($days),
            'leads_by_province' => $analytics->leadsByProvince(),
            'representatives_by_status' => Representative::query()->selectRaw('status, COUNT(*) as total')
                ->groupBy('status')->pluck('total', 'status'),
            'contacts_by_type' => ContactRequest::query()->selectRaw('request_type, COUNT(*) as total')
                ->groupBy('request_type')->pluck('total', 'request_type'),
        ]]);
    }
}
