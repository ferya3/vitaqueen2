<?php

namespace Tests\Feature;

use App\Notifications\NewLeadReceived;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class LeadFormsTest extends TestCase
{
    use RefreshDatabase;

    private function representative(array $overrides = []): array
    {
        return array_merge([
            'full_name' => 'علی رضایی',
            'phone' => '۰۹۱۲۱۲۳۴۵۶۷',
            'province' => 'تهران',
            'city' => 'تهران',
            'activity_type' => 'distributor',
            'distribution_capacity' => '500 کارتن در ماه',
            'has_warehouse' => true,
        ], $overrides);
    }

    public function test_representative_request_is_stored_with_normalized_phone(): void
    {
        $this->postJson('/api/v1/representatives', $this->representative())
            ->assertCreated()
            ->assertJsonPath('data.reference', 'R-000001');

        $this->assertDatabaseHas('representatives', ['phone' => '09121234567', 'status' => 'new', 'province' => 'تهران']);
    }

    public function test_representative_request_validates_input_with_persian_messages(): void
    {
        $this->postJson('/api/v1/representatives?locale=fa', ['phone' => 'abc'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['full_name', 'phone', 'province', 'city', 'activity_type'])
            ->assertJsonPath('errors.province.0', 'وارد کردن استان الزامی است.');
    }

    public function test_honeypot_blocks_bots(): void
    {
        $this->postJson('/api/v1/representatives', $this->representative(['website' => 'http://spam.example']))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('website');

        $this->assertDatabaseCount('representatives', 0);
    }

    public function test_forms_submitted_too_fast_are_rejected(): void
    {
        $this->postJson('/api/v1/contact', [
            'name' => 'Bot', 'email' => 'bot@example.com', 'message' => 'Hello there, this is fast',
            'form_started_at' => now()->getTimestampMs() - 500,
        ])->assertUnprocessable()->assertJsonValidationErrors('form');
    }

    public function test_contact_requires_phone_or_email(): void
    {
        $this->postJson('/api/v1/contact', ['name' => 'Sara', 'message' => 'I would like a quote please'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['phone', 'email']);

        $this->postJson('/api/v1/contact', ['name' => 'Sara', 'email' => 'sara@example.com', 'message' => 'I would like a quote please'])
            ->assertCreated();
    }

    public function test_lead_forms_are_rate_limited(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/v1/contact', ['name' => 'Sara', 'email' => 'sara@example.com', 'message' => 'Message number '.$i])
                ->assertCreated();
        }

        $this->postJson('/api/v1/contact', ['name' => 'Sara', 'email' => 'sara@example.com', 'message' => 'One too many'])
            ->assertTooManyRequests();
    }

    public function test_sales_team_is_notified_when_configured(): void
    {
        Notification::fake();
        config(['aqua.leads_notification_email' => 'sales@example.com']);

        $this->postJson('/api/v1/representatives', $this->representative())->assertCreated();

        Notification::assertSentOnDemand(NewLeadReceived::class);
    }

    public function test_spoofed_forwarded_for_header_cannot_bypass_rate_limit(): void
    {
        for ($i = 0; $i < 3; $i++) {
            $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.7'])
                ->withHeader('X-Forwarded-For', '198.51.100.'.$i)
                ->postJson('/api/v1/contact', ['name' => 'Sara', 'email' => 'sara@example.com', 'message' => 'Message number '.$i])
                ->assertCreated();
        }

        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.7'])
            ->withHeader('X-Forwarded-For', '198.51.100.99')
            ->postJson('/api/v1/contact', ['name' => 'Sara', 'email' => 'sara@example.com', 'message' => 'Still the same client'])
            ->assertTooManyRequests();
    }
}
