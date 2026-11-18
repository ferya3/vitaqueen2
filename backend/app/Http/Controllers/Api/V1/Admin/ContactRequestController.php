<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\ContactRequestUpdateRequest;
use App\Http\Resources\ContactRequestResource;
use App\Models\ContactRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Gate;

class ContactRequestController extends CrudController
{
    protected string $model = ContactRequest::class;

    protected string $resource = ContactRequestResource::class;

    protected string $request = ContactRequestUpdateRequest::class;

    protected array $searchable = ['name', 'phone', 'email', 'subject'];

    protected array $filterable = ['status', 'request_type'];

    protected array $sortable = ['id', 'created_at', 'status'];

    public function store(): JsonResponse
    {
        abort(405, 'Contact requests are created from the public website.');
    }

    /** Opening a new message marks it as read. */
    public function show(int|string $id): JsonResource
    {
        $model = $this->find($id);
        Gate::authorize('view', $model);

        if ($model->status === 'new' && Gate::allows('update', $model)) {
            $model->update(['status' => 'read']);
        }

        return new ContactRequestResource($model);
    }
}
