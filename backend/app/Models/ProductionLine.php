<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use App\Models\Concerns\Sortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionLine extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, Sortable;

    protected $fillable = [
        'name', 'description', 'capacity_per_hour', 'bottle_sizes', 'technology',
        'image_path', 'is_active', 'sort_order',
    ];

    protected array $translatable = ['name', 'description', 'technology'];

    protected $casts = [
        'bottle_sizes' => 'array',
        'is_active' => 'boolean',
    ];
}
