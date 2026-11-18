<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactRequest extends Model
{
    use HasFactory, LogsActivity;

    public const REQUEST_TYPES = ['general', 'wholesale', 'export', 'organization', 'complaint'];

    public const STATUSES = ['new', 'read', 'answered', 'archived'];

    protected $fillable = [
        'name', 'phone', 'email', 'request_type', 'subject', 'message', 'status',
        'admin_notes', 'locale', 'ip', 'user_agent',
    ];
}
