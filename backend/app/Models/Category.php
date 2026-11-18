<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use App\Models\Concerns\Sortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, Sortable;

    protected $fillable = ['slug', 'name', 'description', 'sort_order', 'is_active'];

    protected array $translatable = ['name', 'description'];

    protected $casts = ['is_active' => 'boolean'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
