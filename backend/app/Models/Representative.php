<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * A sales agency / distribution partnership request ("درخواست نمایندگی").
 */
class Representative extends Model
{
    use HasFactory, LogsActivity;

    public const ACTIVITY_TYPES = ['distributor', 'wholesaler', 'retailer', 'exporter', 'organization'];

    public const STATUSES = ['new', 'reviewing', 'contacted', 'approved', 'rejected'];

    protected $fillable = [
        'full_name', 'company_name', 'phone', 'email', 'country', 'province', 'city',
        'activity_type', 'distribution_capacity', 'has_warehouse', 'vehicle_count',
        'message', 'status', 'assigned_to', 'admin_notes', 'locale', 'ip', 'user_agent',
    ];

    protected $casts = ['has_warehouse' => 'boolean'];

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
