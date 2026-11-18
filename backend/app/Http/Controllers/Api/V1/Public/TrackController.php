<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TrackController extends Controller
{
    public function __invoke(Request $request, AnalyticsService $analytics): Response
    {
        $data = $request->validate(['path' => ['required', 'string', 'max:255', 'starts_with:/']]);

        // Ignore admin pages and obvious bots.
        $agent = strtolower((string) $request->userAgent());
        if (! str_starts_with($data['path'], '/admin') && ! preg_match('/bot|crawl|spider|slurp|preview/', $agent)) {
            $analytics->track($data['path']);
        }

        return response()->noContent();
    }
}
