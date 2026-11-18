<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class CategoryResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => $this->t('name'),
            'description' => $this->t('description'),
            'sort_order' => $this->sort_order,
            'is_active' => $this->when($this->isAdmin(), $this->is_active),
            'products_count' => $this->whenCounted('products'),
        ];
    }
}
