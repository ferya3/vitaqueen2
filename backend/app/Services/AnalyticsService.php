<?php

namespace App\Services;

use App\Models\ContactRequest;
use App\Models\PageView;
use App\Models\Representative;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Increment the daily view counter for a path. Uses an upsert so concurrent
     * requests never create duplicate rows.
     */
    public function track(string $path): void
    {
        $path = '/'.ltrim(mb_substr(parse_url($path, PHP_URL_PATH) ?: '/', 0, 250), '/');

        PageView::query()->upsert(
            [['date' => now()->toDateString(), 'path' => $path, 'views' => 1]],
            ['date', 'path'],
            ['views' => DB::raw('page_views.views + 1')],
        );
    }

    /**
     * Daily series for views and leads over the last N days.
     *
     * @return list<array{date: string, views: int, representatives: int, contacts: int}>
     */
    public function dailySeries(int $days = 30): array
    {
        $from = now()->subDays($days - 1)->startOfDay();

        $views = PageView::query()
            ->where('date', '>=', $from->toDateString())
            ->selectRaw('date, SUM(views) as total')
            ->groupBy('date')
            ->pluck('total', 'date')
            ->mapWithKeys(fn ($v, $k) => [substr((string) $k, 0, 10) => (int) $v]);

        $reps = $this->countPerDay(Representative::class, $from);
        $contacts = $this->countPerDay(ContactRequest::class, $from);

        return collect(CarbonPeriod::create($from, now()->startOfDay()))
            ->map(fn ($day) => [
                'date' => $d = $day->toDateString(),
                'views' => $views[$d] ?? 0,
                'representatives' => $reps[$d] ?? 0,
                'contacts' => $contacts[$d] ?? 0,
            ])
            ->values()
            ->all();
    }

    /** @return list<array{path: string, views: int}> */
    public function topPages(int $days = 30, int $limit = 10): array
    {
        return PageView::query()
            ->where('date', '>=', now()->subDays($days - 1)->toDateString())
            ->selectRaw('path, SUM(views) as views')
            ->groupBy('path')
            ->orderByDesc('views')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => ['path' => $row->path, 'views' => (int) $row->views])
            ->all();
    }

    /** @return list<array{province: string, total: int}> */
    public function leadsByProvince(int $limit = 10): array
    {
        return Representative::query()
            ->selectRaw('province, COUNT(*) as total')
            ->groupBy('province')
            ->orderByDesc('total')
            ->limit($limit)
            ->get()
            ->map(fn ($row) => ['province' => $row->province, 'total' => (int) $row->total])
            ->all();
    }

    /** @param class-string<Model> $model */
    private function countPerDay(string $model, $from): Collection
    {
        return $model::query()
            ->where('created_at', '>=', $from)
            ->get(['created_at'])
            ->countBy(fn ($row) => $row->created_at->toDateString());
    }
}
