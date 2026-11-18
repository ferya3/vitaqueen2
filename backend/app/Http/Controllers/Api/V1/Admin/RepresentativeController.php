<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\RepresentativeUpdateRequest;
use App\Http\Resources\RepresentativeResource;
use App\Models\Representative;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RepresentativeController extends CrudController
{
    protected string $model = Representative::class;

    protected string $resource = RepresentativeResource::class;

    protected string $request = RepresentativeUpdateRequest::class;

    protected array $searchable = ['full_name', 'company_name', 'phone', 'email', 'city'];

    protected array $filterable = ['status', 'province', 'activity_type', 'assigned_to'];

    protected array $sortable = ['id', 'created_at', 'status'];

    protected array $with = ['assignee'];

    public function store(): JsonResponse
    {
        abort(405, 'Representative requests are created from the public website.');
    }

    /**
     * Export filtered requests as CSV (UTF-8 with BOM so Excel renders Persian text).
     */
    public function export(Request $request): StreamedResponse
    {
        Gate::authorize('viewAny', Representative::class);

        $query = Representative::query();
        $this->applySearch($query, trim((string) $request->query('search', '')));
        $this->applyFilters($query, (array) $request->query('filter', []));
        $query->orderByDesc('id');

        $columns = ['id', 'full_name', 'company_name', 'phone', 'email', 'province', 'city',
            'activity_type', 'distribution_capacity', 'has_warehouse', 'vehicle_count', 'status', 'created_at'];

        return response()->streamDownload(function () use ($query, $columns) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, $columns);
            $query->chunk(500, function ($rows) use ($out, $columns) {
                foreach ($rows as $row) {
                    fputcsv($out, array_map(
                        fn ($c) => $this->csvSafe($row->{$c} instanceof \DateTimeInterface ? $row->{$c}->format('Y-m-d H:i') : $row->{$c}),
                        $columns,
                    ));
                }
            });
            fclose($out);
        }, 'representatives-'.now()->format('Ymd-His').'.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /** Prevent CSV formula injection when opened in spreadsheet software. */
    private function csvSafe(mixed $value): mixed
    {
        if (is_string($value) && $value !== '' && in_array($value[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
            return "'".$value;
        }

        return is_bool($value) ? (int) $value : $value;
    }
}
