<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    use FlushesPublicCache, HasTranslations;

    protected $fillable = ['product_id', 'media_id', 'path', 'alt', 'is_primary', 'sort_order'];

    protected array $translatable = ['alt'];

    protected $casts = ['is_primary' => 'boolean'];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function media(): BelongsTo
    {
        return $this->belongsTo(Media::class);
    }
}
