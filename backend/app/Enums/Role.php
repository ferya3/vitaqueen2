<?php

namespace App\Enums;

enum Role: string
{
    case SuperAdmin = 'super_admin';
    case ContentManager = 'content_manager';
    case SalesManager = 'sales_manager';
    case QualityManager = 'qc_manager';

    /** @return list<string> */
    public function abilities(): array
    {
        return config('aqua.roles.'.$this->value, []);
    }

    public function label(): string
    {
        return match ($this) {
            self::SuperAdmin => 'مدیر کل',
            self::ContentManager => 'مدیر محتوا',
            self::SalesManager => 'مسئول فروش',
            self::QualityManager => 'مسئول کنترل کیفیت',
        };
    }
}
