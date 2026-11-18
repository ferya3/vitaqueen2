<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $type = in_array($request->query('type'), Certificate::TYPES, true) ? $request->query('type') : null;

        $data = PublicCache::remember("certificates:{$type}", fn () => CertificateResource::collection(
            Certificate::query()->active()->when($type, fn ($q) => $q->where('type', $type))->ordered()->get()
        )->resolve($request));

        return response()->json(['data' => $data]);
    }
}
