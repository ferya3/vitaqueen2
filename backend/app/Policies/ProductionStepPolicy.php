<?php

namespace App\Policies;

class ProductionStepPolicy extends ResourcePolicy
{
    protected string $resource = 'production_steps';
}
