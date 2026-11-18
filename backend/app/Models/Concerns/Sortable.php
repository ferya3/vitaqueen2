<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;

trait Sortable
{
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where($this->getTable().'.is_active', true);
    }
}
