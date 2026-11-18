<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductImageResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'url' => $this->fileUrl($this->path),
            'path' => $this->when($this->isAdmin(), $this->path),
            'alt' => $this->t('alt'),
            'is_primary' => $this->is_primary,
            'sort_order' => $this->sort_order,
        ];
    }
}
