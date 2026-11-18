<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;

class ProductController extends CrudController
{
    protected string $model = Product::class;

    protected string $resource = ProductResource::class;

    protected string $request = ProductRequest::class;

    protected array $searchable = ['slug', 'sku'];

    protected array $searchableJson = ['name'];

    protected array $filterable = ['category_id', 'is_active', 'is_featured', 'bottle_material'];

    protected array $sortable = ['id', 'sort_order', 'volume_ml', 'created_at', 'updated_at'];

    protected string $defaultSort = 'sort_order';

    protected array $with = ['category', 'images', 'primaryImage'];
}
