<?php

use Illuminate\Support\Facades\Route;

// This application is a headless API. The website lives in the Next.js frontend.
Route::get('/', fn () => response()->json([
    'name' => config('app.name'),
    'api' => url('/api/v1'),
    'health' => url('/up'),
]));
