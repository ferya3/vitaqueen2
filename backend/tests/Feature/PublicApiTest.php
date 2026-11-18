<?php

namespace Tests\Feature;

use App\Jobs\RevalidateFrontend;
use App\Models\Article;
use App\Models\Product;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_home_returns_aggregated_payload_in_requested_locale(): void
    {
        $this->getJson('/api/v1/home?locale=en')
            ->assertOk()
            ->assertHeader('Content-Language', 'en')
            ->assertJsonStructure(['data' => ['settings' => ['site', 'hero', 'stats'], 'products', 'production_steps', 'certificates', 'articles']])
            ->assertJsonPath('data.settings.site.name', 'VitaQueen');
    }

    public function test_locale_falls_back_to_accept_language_then_default(): void
    {
        $this->getJson('/api/v1/settings', ['Accept-Language' => 'ar'])->assertHeader('Content-Language', 'ar');
        $this->getJson('/api/v1/settings', ['Accept-Language' => 'de'])->assertHeader('Content-Language', 'fa');
    }

    public function test_placeholder_stats_are_never_published_and_auto_stats_are_live(): void
    {
        $stats = collect($this->getJson('/api/v1/settings')->json('data.stats'));

        $this->assertFalse($stats->contains('key', 'daily_capacity'), 'placeholder stat leaked');
        $this->assertSame(Product::where('is_active', true)->count(), $stats->firstWhere('key', 'products')['value']);
    }

    public function test_inactive_products_are_hidden(): void
    {
        Product::factory()->inactive()->create(['slug' => 'hidden-product']);

        $this->getJson('/api/v1/products/hidden-product')->assertNotFound();
        $this->assertNotContains('hidden-product', array_column($this->getJson('/api/v1/products')->json('data'), 'slug'));
    }

    public function test_products_can_be_filtered_by_size_class(): void
    {
        $sizes = array_unique(array_column($this->getJson('/api/v1/products?size=large')->json('data'), 'size_class'));

        $this->assertSame(['large'], array_values($sizes));
    }

    public function test_product_detail_includes_related_products(): void
    {
        $this->getJson('/api/v1/products/mineral-water-500ml?locale=fa')
            ->assertOk()
            ->assertJsonPath('data.slug', 'mineral-water-500ml')
            ->assertJsonStructure(['data' => ['specs' => [['label', 'value']]], 'related']);
    }

    public function test_draft_articles_are_not_public(): void
    {
        Article::factory()->draft()->create(['slug' => 'secret-draft']);

        $this->getJson('/api/v1/articles/secret-draft')->assertNotFound();
        $this->getJson('/api/v1/articles')->assertOk()->assertJsonStructure(['data', 'meta' => ['total', 'last_page']]);
    }

    public function test_public_cache_is_invalidated_when_content_changes(): void
    {
        $this->getJson('/api/v1/products/mineral-water-500ml?locale=en')->assertJsonPath('data.name', 'Mineral Water 500 ml');

        $product = Product::where('slug', 'mineral-water-500ml')->first();
        $product->update(['name' => array_merge($product->name, ['en' => 'Renamed'])]);

        $this->getJson('/api/v1/products/mineral-water-500ml?locale=en')->assertJsonPath('data.name', 'Renamed');
    }

    public function test_cached_responses_survive_a_serializing_cache_store(): void
    {
        // Production stores (redis/file) serialize values and refuse to restore
        // arbitrary classes, so nested resources must be cached as plain arrays.
        config(['cache.default' => 'file']);
        Cache::setDefaultDriver('file');
        Cache::flush();

        $this->getJson('/api/v1/products/mineral-water-500ml')->assertOk();
        $this->getJson('/api/v1/products/mineral-water-500ml')
            ->assertOk()
            ->assertJsonPath('data.images', [])
            ->assertJsonPath('data.category.slug', 'natural-mineral-water');

        Cache::flush();
    }

    public function test_api_sends_security_headers(): void
    {
        $this->getJson('/api/v1/settings')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options', 'DENY');
    }

    public function test_page_views_are_tracked_but_admin_paths_ignored(): void
    {
        $this->postJson('/api/v1/track', ['path' => '/fa/products'])->assertNoContent();
        $this->postJson('/api/v1/track', ['path' => '/fa/products'])->assertNoContent();
        $this->postJson('/api/v1/track', ['path' => '/admin/products'])->assertNoContent();

        $this->assertDatabaseHas('page_views', ['path' => '/fa/products', 'views' => 2]);
        $this->assertDatabaseMissing('page_views', ['path' => '/admin/products']);
    }

    public function test_content_changes_trigger_frontend_revalidation(): void
    {
        Bus::fake([RevalidateFrontend::class]);
        config(['aqua.revalidate.url' => 'http://frontend/api/revalidate', 'aqua.revalidate.secret' => 'x']);

        Product::first()->update(['is_featured' => false]);

        Bus::assertDispatched(RevalidateFrontend::class);
    }
}
