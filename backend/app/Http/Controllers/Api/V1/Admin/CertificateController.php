<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Requests\Admin\CertificateRequest;
use App\Http\Resources\CertificateResource;
use App\Models\Certificate;

class CertificateController extends CrudController
{
    protected string $model = Certificate::class;

    protected string $resource = CertificateResource::class;

    protected string $request = CertificateRequest::class;

    protected array $searchable = ['certificate_number'];

    protected array $searchableJson = ['title', 'issuer'];

    protected array $filterable = ['type', 'is_active'];

    protected array $sortable = ['id', 'sort_order', 'issued_at', 'expires_at'];

    protected string $defaultSort = 'sort_order';
}
