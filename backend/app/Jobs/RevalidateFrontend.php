<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Tells the Next.js frontend to drop its cached content (tag "content") so
 * admin edits appear on the website within seconds.
 *
 * Unique for a few seconds: a burst of saves (e.g. a seeder or bulk edit)
 * triggers a single revalidation.
 */
class RevalidateFrontend implements ShouldBeUnique, ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public int $tries = 3;

    public int $uniqueFor = 5;

    public function handle(): void
    {
        $url = config('aqua.revalidate.url');
        $secret = config('aqua.revalidate.secret');

        if (blank($url) || blank($secret)) {
            return;
        }

        $response = Http::timeout(5)
            ->withHeaders(['X-Revalidate-Secret' => $secret])
            ->post($url, ['tags' => ['content']]);

        if ($response->failed()) {
            Log::warning('Frontend revalidation failed', ['status' => $response->status()]);
            $this->release(10);
        }
    }
}
