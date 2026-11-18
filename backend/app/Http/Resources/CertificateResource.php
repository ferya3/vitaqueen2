<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class CertificateResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->t('title'),
            'issuer' => $this->t('issuer'),
            'description' => $this->t('description'),
            'certificate_number' => $this->certificate_number,
            'issued_at' => $this->issued_at?->toDateString(),
            'expires_at' => $this->expires_at?->toDateString(),
            'is_expired' => $this->isExpired(),
            'image_url' => $this->fileUrl($this->image_path),
            'file_url' => $this->fileUrl($this->file_path),
            'image_path' => $this->when($admin, $this->image_path),
            'file_path' => $this->when($admin, $this->file_path),
            'is_active' => $this->when($admin, $this->is_active),
            'sort_order' => $this->sort_order,
        ];
    }
}
