<?php

namespace App\Models;

use App\Models\Concerns\FlushesPublicCache;
use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

/**
 * Key / value site settings. Values are JSON so they can hold scalars,
 * translated strings ({fa, en, ar}) or structured data (e.g. stats).
 */
class Setting extends Model
{
    use FlushesPublicCache, LogsActivity;

    protected $fillable = ['group', 'key', 'value', 'is_public'];

    protected $casts = [
        'value' => 'array',
        'is_public' => 'boolean',
    ];
}
