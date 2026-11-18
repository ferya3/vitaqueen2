<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use App\Models\Concerns\Sortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, SoftDeletes, Sortable;

    protected $fillable = [
        'category_id', 'slug', 'sku', 'name', 'short_description', 'description',
        'volume_ml', 'bottle_material', 'units_per_pack', 'packs_per_pallet',
        'shelf_life_months', 'ph', 'tds', 'mineral_composition', 'specs', 'barcode',
        'accent_color', 'is_featured', 'is_active', 'sort_order', 'meta_title', 'meta_description',
    ];

    protected array $translatable = ['name', 'short_description', 'description', 'meta_title', 'meta_description'];

    protected $casts = [
        'mineral_composition' => 'array',
        'specs' => 'array',
        'ph' => 'decimal:2',
        'is_featured' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderByDesc('is_primary')->orderBy('sort_order');
    }

    public function primaryImage(): HasOne
    {
        // ProductImageController guarantees exactly one primary image per product.
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * Human readable size class used for grouping: small (<= 600 ml), medium (<= 1.5 L), large.
     */
    public function sizeClass(): string
    {
        return match (true) {
            $this->volume_ml <= 600 => 'small',
            $this->volume_ml <= 1500 => 'medium',
            default => 'large',
        };
    }
}
