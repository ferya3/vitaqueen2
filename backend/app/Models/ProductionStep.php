<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use App\Models\Concerns\Sortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductionStep extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, Sortable;

    protected $fillable = ['key', 'title', 'description', 'icon', 'image_path', 'sort_order', 'is_active'];

    protected array $translatable = ['title', 'description'];

    protected $casts = ['is_active' => 'boolean'];
}
