<?php

namespace App\Services;

use App\Models\ContactRequest;
use App\Models\Representative;
use App\Notifications\NewLeadReceived;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class LeadService
{
    public function createRepresentative(array $data, Request $request): Representative
    {
        $lead = Representative::create(array_merge(
            Arr::except($data, ['website', 'form_started_at']),
            $this->meta($request),
            ['status' => 'new', 'country' => $data['country'] ?? 'IR'],
        ));

        $this->notify($lead);

        return $lead;
    }

    public function createContact(array $data, Request $request): ContactRequest
    {
        $lead = ContactRequest::create(array_merge(
            Arr::except($data, ['website', 'form_started_at']),
            $this->meta($request),
            ['status' => 'new', 'request_type' => $data['request_type'] ?? 'general'],
        ));

        $this->notify($lead);

        return $lead;
    }

    private function meta(Request $request): array
    {
        return [
            'ip' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 500, ''),
            'locale' => app()->getLocale(),
        ];
    }

    private function notify(Representative|ContactRequest $lead): void
    {
        $email = config('aqua.leads_notification_email');

        if (filled($email)) {
            Notification::route('mail', $email)->notify(new NewLeadReceived($lead));
        }
    }
}
