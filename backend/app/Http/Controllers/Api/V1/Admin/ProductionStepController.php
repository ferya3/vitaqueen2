<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ProductionStepRequest;
use App\Http\Resources\ProductionStepResource;
use App\Models\ProductionStep;

class ProductionStepController extends CrudController
{
    protected string $model = ProductionStep::class;

    protected string $resource = ProductionStepResource::class;

    protected string $request = ProductionStepRequest::class;

    protected array $searchable = ['key'];

    protected array $searchableJson = ['title'];

    protected array $filterable = ['is_active'];

    protected array $sortable = ['id', 'sort_order'];

    protected string $defaultSort = 'sort_order';
}
