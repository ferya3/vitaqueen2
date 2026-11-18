<?php

use App\Http\Controllers\Api\V1\Admin;
use App\Http\Controllers\Api\V1\Public;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API v1
|--------------------------------------------------------------------------
| Public endpoints are localized (?locale=fa|en|ar or Accept-Language) and
| cached. Admin endpoints require a Sanctum bearer token and role abilities.
*/

Route::prefix('v1')->group(function () {
    // ---------------------------------------------------------------- Public
    Route::middleware(['throttle:public'])->group(function () {
        Route::get('home', Public\HomeController::class)->name('public.home');
        Route::get('settings', Public\SettingController::class)->name('public.settings');
        Route::get('categories', [Public\CategoryController::class, 'index'])->name('public.categories');
        Route::get('products', [Public\ProductController::class, 'index'])->name('public.products.index');
        Route::get('products/{slug}', [Public\ProductController::class, 'show'])->name('public.products.show');
        Route::get('articles', [Public\ArticleController::class, 'index'])->name('public.articles.index');
        Route::get('articles/{slug}', [Public\ArticleController::class, 'show'])->name('public.articles.show');
        Route::get('certificates', [Public\CertificateController::class, 'index'])->name('public.certificates');
        Route::get('production-lines', [Public\ProductionController::class, 'lines'])->name('public.production-lines');
        Route::get('production-steps', [Public\ProductionController::class, 'steps'])->name('public.production-steps');
        Route::get('pages/{slug}', [Public\PageController::class, 'show'])->name('public.pages.show');
        Route::get('sitemap', Public\SitemapController::class)->name('public.sitemap');
    });

    Route::middleware(['throttle:forms'])->group(function () {
        Route::post('representatives', [Public\LeadController::class, 'representative'])->name('public.representatives.store');
        Route::post('contact', [Public\LeadController::class, 'contact'])->name('public.contact.store');
    });

    Route::post('track', Public\TrackController::class)->middleware('throttle:track')->name('public.track');

    // ----------------------------------------------------------------- Admin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::post('auth/login', [Admin\AuthController::class, 'login'])->middleware('throttle:login')->name('auth.login');

        Route::middleware(['auth:sanctum', 'active', 'throttle:admin'])->group(function () {
            Route::get('auth/me', [Admin\AuthController::class, 'me'])->name('auth.me');
            Route::post('auth/logout', [Admin\AuthController::class, 'logout'])->name('auth.logout');

            Route::get('dashboard', Admin\DashboardController::class)->name('dashboard');
            Route::get('reports', Admin\ReportController::class)->name('reports');

            Route::apiResource('products', Admin\ProductController::class);
            Route::post('products/{product}/images', [Admin\ProductImageController::class, 'store'])->name('products.images.store');
            Route::patch('products/{product}/images/{image}', [Admin\ProductImageController::class, 'update'])->name('products.images.update');
            Route::delete('products/{product}/images/{image}', [Admin\ProductImageController::class, 'destroy'])->name('products.images.destroy');

            Route::apiResource('categories', Admin\CategoryController::class);
            Route::apiResource('articles', Admin\ArticleController::class);
            Route::apiResource('pages', Admin\PageController::class);
            Route::apiResource('certificates', Admin\CertificateController::class);
            Route::apiResource('production-lines', Admin\ProductionLineController::class);
            Route::apiResource('production-steps', Admin\ProductionStepController::class);
            Route::apiResource('users', Admin\UserController::class);

            Route::get('representatives/export', [Admin\RepresentativeController::class, 'export'])->name('representatives.export');
            Route::apiResource('representatives', Admin\RepresentativeController::class)->except('store');
            Route::apiResource('contact-requests', Admin\ContactRequestController::class)->except('store');

            Route::get('media', [Admin\MediaController::class, 'index'])->name('media.index');
            Route::post('media', [Admin\MediaController::class, 'store'])->name('media.store');
            Route::patch('media/{media}', [Admin\MediaController::class, 'update'])->name('media.update');
            Route::delete('media/{media}', [Admin\MediaController::class, 'destroy'])->name('media.destroy');

            Route::get('settings', [Admin\SettingController::class, 'index'])->name('settings.index');
            Route::put('settings', [Admin\SettingController::class, 'update'])->name('settings.update');

            Route::get('activity-logs', [Admin\ActivityLogController::class, 'index'])->name('activity-logs.index');
        });
    });
});
