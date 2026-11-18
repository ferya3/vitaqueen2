<?php

namespace Tests\Feature;

use App\Enums\Role;
use App\Models\ActivityLog;
use App\Models\Article;
use App\Models\Product;
use App\Models\Representative;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    private function actingAsRole(Role $role): User
    {
        $user = User::factory()->role($role)->create();
        Sanctum::actingAs($user);

        return $user;
    }

    public function test_login_returns_token_and_rejects_bad_credentials(): void
    {
        User::factory()->create(['email' => 'admin@example.com', 'password' => 'Secret-password-1']);

        $this->postJson('/api/v1/admin/auth/login', ['email' => 'admin@example.com', 'password' => 'wrong'])
            ->assertUnprocessable();

        $token = $this->postJson('/api/v1/admin/auth/login', ['email' => 'admin@example.com', 'password' => 'Secret-password-1'])
            ->assertOk()
            ->assertJsonStructure(['token', 'expires_at', 'user' => ['role', 'abilities']])
            ->json('token');

        $this->withToken($token)->getJson('/api/v1/admin/auth/me')->assertOk();
    }

    public function test_login_is_locked_after_repeated_failures(): void
    {
        User::factory()->create(['email' => 'admin@example.com']);

        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/admin/auth/login', ['email' => 'admin@example.com', 'password' => 'wrong'.$i]);
        }

        $this->postJson('/api/v1/admin/auth/login', ['email' => 'admin@example.com', 'password' => 'password'])
            ->assertStatus(429);
    }

    public function test_inactive_users_cannot_login(): void
    {
        User::factory()->inactive()->create(['email' => 'old@example.com', 'password' => 'Secret-password-1']);

        $this->postJson('/api/v1/admin/auth/login', ['email' => 'old@example.com', 'password' => 'Secret-password-1'])
            ->assertUnprocessable();
    }

    public function test_guests_cannot_reach_admin_endpoints(): void
    {
        $this->getJson('/api/v1/admin/products')->assertUnauthorized();
    }

    public function test_content_manager_can_crud_products_with_translations(): void
    {
        $this->actingAsRole(Role::ContentManager);

        $id = $this->postJson('/api/v1/admin/products', [
            'slug' => 'new-water-750',
            'name' => ['fa' => 'آب ۷۵۰', 'en' => 'Water 750'],
            'volume_ml' => 750,
            'specs' => [['label' => ['fa' => 'حجم', 'en' => 'Volume'], 'value' => ['fa' => '۷۵۰', 'en' => '750 ml']]],
        ])->assertCreated()->assertJsonPath('data.name.en', 'Water 750')->json('data.id');

        $this->patchJson("/api/v1/admin/products/{$id}", ['is_featured' => true])
            ->assertOk()->assertJsonPath('data.is_featured', true);

        $this->getJson('/api/v1/admin/products?search=water 750')->assertOk()->assertJsonCount(1, 'data');

        $this->deleteJson("/api/v1/admin/products/{$id}")->assertNoContent();
        $this->assertSoftDeleted('products', ['id' => $id]);
    }

    public function test_product_validation_requires_default_locale_and_unique_slug(): void
    {
        $this->actingAsRole(Role::ContentManager);
        Product::factory()->create(['slug' => 'taken']);

        $this->postJson('/api/v1/admin/products', ['slug' => 'taken', 'name' => ['en' => 'x'], 'volume_ml' => 500])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug', 'name.fa']);
    }

    public function test_roles_are_enforced(): void
    {
        $this->actingAsRole(Role::SalesManager);

        $this->getJson('/api/v1/admin/representatives')->assertOk();
        $this->getJson('/api/v1/admin/products')->assertOk(); // read-only access
        $this->postJson('/api/v1/admin/products', [])->assertForbidden();
        $this->getJson('/api/v1/admin/certificates')->assertForbidden();
        $this->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_quality_manager_manages_certificates_only(): void
    {
        $this->actingAsRole(Role::QualityManager);

        $this->postJson('/api/v1/admin/certificates', ['type' => 'lab_report', 'title' => ['fa' => 'گزارش']])->assertCreated();
        $this->getJson('/api/v1/admin/representatives')->assertForbidden();
        $this->getJson('/api/v1/admin/articles')->assertForbidden();
    }

    public function test_sales_can_update_lead_status_and_export_csv(): void
    {
        $this->actingAsRole(Role::SalesManager);
        $lead = Representative::factory()->create(['full_name' => '=HYPERLINK("x")']);

        $this->patchJson("/api/v1/admin/representatives/{$lead->id}", ['status' => 'contacted', 'admin_notes' => 'Called'])
            ->assertOk()->assertJsonPath('data.status', 'contacted');

        $csv = $this->get('/api/v1/admin/representatives/export')->assertOk()->streamedContent();
        $this->assertStringContainsString("'=HYPERLINK", $csv, 'CSV formula injection not neutralized');
    }

    public function test_super_admin_manages_users_but_cannot_delete_self(): void
    {
        $admin = $this->actingAsRole(Role::SuperAdmin);

        $this->postJson('/api/v1/admin/users', [
            'name' => 'Editor', 'email' => 'editor@example.com', 'password' => 'Str0ngPassword', 'role' => 'content_manager',
        ])->assertCreated();

        $this->deleteJson("/api/v1/admin/users/{$admin->id}")->assertUnprocessable();
        $this->patchJson("/api/v1/admin/users/{$admin->id}", ['is_active' => false])->assertUnprocessable();
    }

    public function test_admin_changes_are_written_to_activity_log(): void
    {
        $user = $this->actingAsRole(Role::ContentManager);

        $this->postJson('/api/v1/admin/categories', ['slug' => 'new-cat', 'name' => ['fa' => 'دسته']])->assertCreated();

        $this->assertTrue(ActivityLog::where('user_id', $user->id)->where('action', 'created')->exists());
    }

    public function test_media_upload_and_product_image_attach(): void
    {
        Storage::fake('public');
        $this->actingAsRole(Role::ContentManager);
        $product = Product::factory()->create();

        $this->postJson('/api/v1/admin/media', ['file' => UploadedFile::fake()->create('evil.php', 10, 'text/x-php')])
            ->assertUnprocessable();

        $image = $this->postJson("/api/v1/admin/products/{$product->id}/images", [
            'file' => UploadedFile::fake()->image('bottle.png', 800, 1200),
            'alt' => ['fa' => 'بطری'],
        ])->assertCreated()->assertJsonPath('data.is_primary', true)->json('data');

        Storage::disk('public')->assertExists($product->images()->first()->path);
        $this->assertNotNull($image['url']);
    }

    public function test_settings_update_flushes_public_settings(): void
    {
        $this->actingAsRole(Role::ContentManager);

        $this->putJson('/api/v1/admin/settings', ['settings' => [
            ['key' => 'stats', 'value' => [['key' => 'daily_capacity', 'value' => 250000, 'label' => ['fa' => 'ظرفیت']]]],
        ]])->assertOk();

        $this->getJson('/api/v1/settings')->assertJsonPath('data.stats.0.value', 250000);
    }

    public function test_dashboard_and_reports(): void
    {
        $this->actingAsRole(Role::SuperAdmin);
        Representative::factory()->count(3)->create();

        $this->getJson('/api/v1/admin/dashboard')->assertOk()->assertJsonPath('data.counts.representatives_new', 3);
        $this->getJson('/api/v1/admin/reports?days=7')->assertOk()->assertJsonCount(7, 'data.series');
    }

    public function test_rich_text_is_sanitized_on_save(): void
    {
        $this->actingAsRole(Role::ContentManager);

        $this->postJson('/api/v1/admin/articles', [
            'slug' => 'xss-test',
            'title' => ['fa' => 'تست'],
            'body' => ['fa' => '<p>متن</p><script>alert(1)</script><img src=x onerror=alert(1)>'],
        ])->assertCreated();

        $body = Article::where('slug', 'xss-test')->first()->body['fa'];
        $this->assertStringNotContainsString('<script', $body);
        $this->assertStringNotContainsString('onerror', $body);
        $this->assertStringContainsString('<p>متن</p>', $body);
    }
}
