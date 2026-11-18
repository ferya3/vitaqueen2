<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Database\Eloquent\Model;

class ArticleController extends CrudController
{
    protected string $model = Article::class;

    protected string $resource = ArticleResource::class;

    protected string $request = ArticleRequest::class;

    protected array $searchable = ['slug'];

    protected array $searchableJson = ['title'];

    protected array $filterable = ['type', 'is_published'];

    protected array $sortable = ['id', 'published_at', 'created_at', 'views'];

    protected string $defaultSort = '-id';

    protected array $with = ['author'];

    protected function prepare(array $data, ?Model $model = null): array
    {
        if (! $model) {
            $data['author_id'] = auth()->id();
        }

        // Publishing without a date publishes immediately.
        if (($data['is_published'] ?? $model?->is_published) && empty($data['published_at']) && ! $model?->published_at) {
            $data['published_at'] = now();
        }

        return $data;
    }
}
