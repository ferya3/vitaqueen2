<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ProductionLineRequest;
use App\Http\Resources\ProductionLineResource;
use App\Models\ProductionLine;

class ProductionLineController extends CrudController
{
    protected string $model = ProductionLine::class;

    protected string $resource = ProductionLineResource::class;

    protected string $request = ProductionLineRequest::class;

    protected array $searchableJson = ['name'];

    protected array $filterable = ['is_active'];

    protected array $sortable = ['id', 'sort_order', 'capacity_per_hour'];

    protected string $defaultSort = 'sort_order';
}
