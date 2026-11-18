<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity;

    protected $fillable = [
        'slug', 'title', 'excerpt', 'body', 'sections', 'cover_path',
        'meta_title', 'meta_description', 'is_published',
    ];

    protected array $translatable = ['title', 'excerpt', 'body', 'meta_title', 'meta_description'];

    protected $casts = [
        'sections' => 'array',
        'is_published' => 'boolean',
    ];
}
