<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ContactRequestResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'email' => $this->email,
            'request_type' => $this->request_type,
            'subject' => $this->subject,
            'message' => $this->message,
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'locale' => $this->locale,
            'ip' => $this->ip,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
