<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class ActivityLogResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action,
            'subject_type' => $this->subject_type ? class_basename($this->subject_type) : null,
            'subject_id' => $this->subject_id,
            'description' => $this->description,
            'properties' => $this->properties,
            'user' => $this->whenLoaded('user', fn () => $this->user?->only(['id', 'name'])),
            'ip' => $this->ip,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
