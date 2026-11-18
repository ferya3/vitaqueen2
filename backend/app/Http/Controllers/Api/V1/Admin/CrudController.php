<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Gate;

/**
 * Generic admin CRUD: pagination, search, filters, sorting and policy checks.
 *
 * Subclasses declare the model, resource and form request classes, plus
 * searchable / filterable / sortable columns.
 */
abstract class CrudController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    /** @var class-string<JsonResource> */
    protected string $resource;

    /** @var class-string<FormRequest> */
    protected string $request;

    /** Plain columns searched with LIKE. */
    protected array $searchable = [];

    /** JSON (translatable) columns searched with LIKE on their text. */
    protected array $searchableJson = [];

    /** Columns that can be filtered with ?filter[column]=value */
    protected array $filterable = [];

    protected array $sortable = ['id', 'created_at', 'updated_at'];

    protected string $defaultSort = '-id';

    /** Relations eager loaded for every response. */
    protected array $with = [];

    public function index(Request $request): ResourceCollection
    {
        Gate::authorize('viewAny', $this->model);

        $query = $this->query()->with($this->with);
        $this->applySearch($query, trim((string) $request->query('search', '')));
        $this->applyFilters($query, (array) $request->query('filter', []));
        $this->applySort($query, (string) $request->query('sort', $this->defaultSort));

        $perPage = min(100, max(1, (int) $request->query('per_page', 20)));

        return $this->resource::collection($query->paginate($perPage)->withQueryString());
    }

    public function show(int|string $id): JsonResource
    {
        $model = $this->find($id);
        Gate::authorize('view', $model);

        return new $this->resource($model->load($this->with));
    }

    public function store(): JsonResponse
    {
        Gate::authorize('create', $this->model);

        $data = $this->prepare($this->validated());
        $model = $this->model::create($data);
        $this->afterSave($model, $data);

        return (new $this->resource($model->fresh($this->with)))->response()->setStatusCode(201);
    }

    public function update(int|string $id): JsonResource
    {
        $model = $this->find($id);
        Gate::authorize('update', $model);

        $data = $this->prepare($this->validated(), $model);
        $model->update($data);
        $this->afterSave($model, $data);

        return new $this->resource($model->fresh($this->with));
    }

    public function destroy(int|string $id): JsonResponse
    {
        $model = $this->find($id);
        Gate::authorize('delete', $model);

        $model->delete();

        return response()->json(null, 204);
    }

    protected function query(): Builder
    {
        return $this->model::query();
    }

    protected function find(int|string $id): Model
    {
        return $this->query()->findOrFail($id);
    }

    protected function validated(): array
    {
        return app($this->request)->validated();
    }

    /** Hook to transform validated data before persisting. */
    protected function prepare(array $data, ?Model $model = null): array
    {
        return $data;
    }

    /** Hook executed after create / update. */
    protected function afterSave(Model $model, array $data): void {}

    protected function applySearch(Builder $query, string $term): void
    {
        if ($term === '' || ($this->searchable === [] && $this->searchableJson === [])) {
            return;
        }

        $like = '%'.str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], mb_strtolower($term)).'%';
        $driver = $query->getConnection()->getDriverName();

        $query->where(function (Builder $q) use ($like, $driver) {
            foreach ($this->searchable as $column) {
                $q->orWhereRaw("LOWER({$column}) LIKE ?", [$like]);
            }
            foreach ($this->searchableJson as $column) {
                $cast = $driver === 'pgsql' ? "CAST({$column} AS TEXT)" : $column;
                $q->orWhereRaw("LOWER({$cast}) LIKE ?", [$like]);
            }
        });
    }

    protected function applyFilters(Builder $query, array $filters): void
    {
        foreach ($filters as $column => $value) {
            if (! in_array($column, $this->filterable, true) || $value === '' || $value === null) {
                continue;
            }
            if (in_array($value, ['true', 'false'], true)) {
                $value = $value === 'true';
            }
            $query->where($column, $value);
        }
    }

    protected function applySort(Builder $query, string $sort): void
    {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-');

        if (! in_array($column, $this->sortable, true)) {
            $column = ltrim($this->defaultSort, '-');
            $direction = str_starts_with($this->defaultSort, '-') ? 'desc' : 'asc';
        }

        $query->orderBy($column, $direction);
    }
}
