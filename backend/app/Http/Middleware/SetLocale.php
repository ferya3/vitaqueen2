<?php

namespace App\Http\Middleware;

use App\Support\Locales;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = Locales::fromRequest($request);
        app()->setLocale($locale);

        $response = $next($request);
        $response->headers->set('Content-Language', $locale);
        $response->headers->set('Vary', trim($response->headers->get('Vary').', Accept-Language', ', '));

        return $response;
    }
}
