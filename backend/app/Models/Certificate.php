<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use App\Models\Concerns\Sortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use FlushesPublicCache, HasFactory, HasTranslations, LogsActivity, Sortable;

    public const TYPES = ['certificate', 'lab_report', 'standard'];

    protected $fillable = [
        'type', 'title', 'issuer', 'description', 'certificate_number', 'issued_at',
        'expires_at', 'image_path', 'file_path', 'is_active', 'sort_order',
    ];

    protected array $translatable = ['title', 'issuer', 'description'];

    protected $casts = [
        'issued_at' => 'date',
        'expires_at' => 'date',
        'is_active' => 'boolean',
    ];

    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }
}
