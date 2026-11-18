<?php

namespace App\Models;

use App\Models\Concerns\HasTranslations;
use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Media extends Model
{
    use HasFactory, HasTranslations, LogsActivity;

    protected $fillable = [
        'disk', 'path', 'original_name', 'mime_type', 'size', 'width', 'height',
        'alt', 'collection', 'uploaded_by',
    ];

    protected array $translatable = ['alt'];

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function url(): string
    {
        return Storage::disk($this->disk)->url($this->path);
    }

    public function isImage(): bool
    {
        return str_starts_with($this->mime_type, 'image/');
    }
}
