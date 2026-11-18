<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, SoftDeletes;

    protected $fillable = [
        'slug', 'type', 'title', 'excerpt', 'body', 'cover_path', 'author_id',
        'is_published', 'published_at', 'meta_title', 'meta_description',
    ];

    protected array $translatable = ['title', 'excerpt', 'body', 'meta_title', 'meta_description'];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}
