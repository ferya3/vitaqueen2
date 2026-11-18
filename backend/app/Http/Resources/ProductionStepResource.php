<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ProductionStepResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'key' => $this->key,
            'title' => $this->t('title'),
            'description' => $this->t('description'),
            'icon' => $this->icon,
            'image_url' => $this->fileUrl($this->image_path),
            'image_path' => $this->when($admin, $this->image_path),
            'is_active' => $this->when($admin, $this->is_active),
            'sort_order' => $this->sort_order,
        ];
    }
}
