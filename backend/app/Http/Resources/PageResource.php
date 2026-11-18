<?php

namespace App\Http\Resources;

use App\Support\Localize;
use Illuminate\Http\Request;

class PageResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->t('title'),
            'excerpt' => $this->t('excerpt'),
            'body' => $this->t('body'),
            'sections' => $admin ? ($this->sections ?? []) : Localize::deep($this->sections ?? []),
            'cover_url' => $this->fileUrl($this->cover_path),
            'cover_path' => $this->when($admin, $this->cover_path),
            'is_published' => $this->when($admin, $this->is_published),
            'meta_title' => $this->t('meta_title'),
            'meta_description' => $this->t('meta_description'),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
