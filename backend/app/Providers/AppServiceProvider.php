<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpFoundation\IpUtils;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Model::shouldBeStrict(! $this->app->isProduction());

        // Active super admins pass every authorization check.
        Gate::before(fn (User $user) => $user->is_active && $user->isSuperAdmin() ? true : null);

        $this->configureRateLimiting();
    }

    private function configureRateLimiting(): void
    {
        // Server-side rendering traffic from the Next.js container arrives from a private
        // address (no X-Forwarded-For) and must not share one public bucket.
        RateLimiter::for('public', fn (Request $request) => IpUtils::isPrivateIp((string) $request->ip())
            ? Limit::none()
            : Limit::perMinute(240)->by($request->ip()));

        // Lead forms: protect against spam floods.
        RateLimiter::for('forms', fn (Request $request) => [
            Limit::perMinute(3)->by('forms-m:'.$request->ip()),
            Limit::perDay(20)->by('forms-d:'.$request->ip()),
        ]);

        RateLimiter::for('track', fn (Request $request) => Limit::perMinute(60)->by($request->ip()));

        RateLimiter::for('login', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        RateLimiter::for('admin', fn (Request $request) => Limit::perMinute(300)->by($request->user()?->id ?: $request->ip()));
    }
}
