<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class RepresentativeResource extends BaseResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'company_name' => $this->company_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'country' => $this->country,
            'province' => $this->province,
            'city' => $this->city,
            'activity_type' => $this->activity_type,
            'distribution_capacity' => $this->distribution_capacity,
            'has_warehouse' => $this->has_warehouse,
            'vehicle_count' => $this->vehicle_count,
            'message' => $this->message,
            'status' => $this->status,
            'assigned_to' => $this->assigned_to,
            'assignee' => $this->whenLoaded('assignee', fn () => $this->assignee?->only(['id', 'name'])),
            'admin_notes' => $this->admin_notes,
            'locale' => $this->locale,
            'ip' => $this->ip,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
