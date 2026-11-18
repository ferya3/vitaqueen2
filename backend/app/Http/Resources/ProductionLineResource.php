<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductionLineResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'name' => $this->t('name'),
            'description' => $this->t('description'),
            'technology' => $this->t('technology'),
            'capacity_per_hour' => $this->capacity_per_hour,
            'bottle_sizes' => $this->bottle_sizes ?? [],
            'image_url' => $this->fileUrl($this->image_path),
            'image_path' => $this->when($admin, $this->image_path),
            'is_active' => $this->when($admin, $this->is_active),
            'sort_order' => $this->sort_order,
        ];
    }
}
