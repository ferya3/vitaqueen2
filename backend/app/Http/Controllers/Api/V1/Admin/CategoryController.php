<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Database\Eloquent\Builder;

class CategoryController extends CrudController
{
    protected string $model = Category::class;

    protected string $resource = CategoryResource::class;

    protected string $request = CategoryRequest::class;

    protected array $searchable = ['slug'];

    protected array $searchableJson = ['name'];

    protected array $filterable = ['is_active'];

    protected array $sortable = ['id', 'sort_order', 'created_at'];

    protected string $defaultSort = 'sort_order';

    protected function query(): Builder
    {
        return Category::query()->withCount('products');
    }
}
