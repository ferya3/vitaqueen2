<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    public $timestamps = false;

    protected $fillable = ['date', 'path', 'views'];

    protected $casts = ['date' => 'date'];
}
