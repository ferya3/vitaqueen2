<?php

namespace App\Policies;

class ProductionLinePolicy extends ResourcePolicy
{
    protected string $resource = 'production_lines';
}
