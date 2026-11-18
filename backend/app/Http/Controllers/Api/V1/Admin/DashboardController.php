<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\ContactRequestResource;
use App\Http\Resources\RepresentativeResource;
use App\Models\ActivityLog;
use App\Models\Article;
use App\Models\Certificate;
use App\Models\ContactRequest;
use App\Models\PageView;
use App\Models\Product;
use App\Models\Representative;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $canSales = $user->hasAbility('representatives', false);

        $counts = [
            'products' => Product::query()->where('is_active', true)->count(),
            'articles' => Article::query()->published()->count(),
            'certificates' => Certificate::query()->where('is_active', true)->count(),
            'expiring_certificates' => Certificate::query()->where('is_active', true)
                ->whereBetween('expires_at', [now(), now()->addDays(60)])->count(),
            'views_7d' => (int) PageView::query()->where('date', '>=', now()->subDays(6)->toDateString())->sum('views'),
        ];

        if ($canSales) {
            $counts += [
                'representatives_new' => Representative::query()->where('status', 'new')->count(),
                'representatives_total' => Representative::query()->count(),
                'contacts_new' => ContactRequest::query()->where('status', 'new')->count(),
            ];
        }

        // Warn editors when homepage statistics still carry sample values.
        $stats = Setting::query()->where('key', 'stats')->value('value');
        $placeholderStats = is_array($stats) && collect($stats)->contains(fn ($s) => ($s['is_placeholder'] ?? false) === true);

        return response()->json(['data' => [
            'counts' => $counts,
            'warnings' => array_values(array_filter([
                $placeholderStats ? 'stats_placeholder' : null,
                $counts['expiring_certificates'] > 0 ? 'certificates_expiring' : null,
            ])),
            'latest_representatives' => $canSales
                ? RepresentativeResource::collection(Representative::query()->latest()->limit(5)->get())->resolve($request)
                : [],
            'latest_contacts' => $canSales
                ? ContactRequestResource::collection(ContactRequest::query()->latest()->limit(5)->get())->resolve($request)
                : [],
            'recent_activity' => $user->isSuperAdmin()
                ? ActivityLogResource::collection(ActivityLog::query()->with('user')->latest('id')->limit(10)->get())->resolve($request)
                : [],
        ]]);
    }
}
