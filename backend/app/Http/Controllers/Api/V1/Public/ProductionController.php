<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductionLineResource;
use App\Http\Resources\ProductionStepResource;
use App\Models\ProductionLine;
use App\Models\ProductionStep;
use App\Support\PublicCache;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductionController extends Controller
{
    public function lines(Request $request): JsonResponse
    {
        $data = PublicCache::remember('production-lines', fn () => ProductionLineResource::collection(
            ProductionLine::query()->active()->ordered()->get()
        )->resolve($request));

        return response()->json(['data' => $data]);
    }

    public function steps(Request $request): JsonResponse
    {
        $data = PublicCache::remember('production-steps', fn () => ProductionStepResource::collection(
            ProductionStep::query()->active()->ordered()->get()
        )->resolve($request));

        return response()->json(['data' => $data]);
    }
}
