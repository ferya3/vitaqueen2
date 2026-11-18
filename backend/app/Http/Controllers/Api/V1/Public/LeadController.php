<?php

namespace App\Http\Controllers\Api\V1\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactRequest;
use App\Http\Requests\Public\StoreRepresentativeRequest;
use App\Services\LeadService;
use Illuminate\Http\JsonResponse;

/**
 * Public lead capture endpoints (agency requests and the contact form).
 * Protected by validation, honeypot, minimum fill time and rate limiting.
 */
class LeadController extends Controller
{
    public function __construct(private readonly LeadService $leads) {}

    public function representative(StoreRepresentativeRequest $request): JsonResponse
    {
        $lead = $this->leads->createRepresentative($request->validated(), $request);

        return response()->json([
            'message' => __('messages.representative_received'),
            'data' => ['reference' => 'R-'.str_pad((string) $lead->id, 6, '0', STR_PAD_LEFT)],
        ], 201);
    }

    public function contact(StoreContactRequest $request): JsonResponse
    {
        $lead = $this->leads->createContact($request->validated(), $request);

        return response()->json([
            'message' => __('messages.contact_received'),
            'data' => ['reference' => 'C-'.str_pad((string) $lead->id, 6, '0', STR_PAD_LEFT)],
        ], 201);
    }
}
