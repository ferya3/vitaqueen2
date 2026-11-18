<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\PageRequest;
use App\Http\Resources\PageResource;
use App\Models\Page;

class PageController extends CrudController
{
    protected string $model = Page::class;

    protected string $resource = PageResource::class;

    protected string $request = PageRequest::class;

    protected array $searchable = ['slug'];

    protected array $searchableJson = ['title'];

    protected array $filterable = ['is_published'];

    protected string $defaultSort = 'id';
}
