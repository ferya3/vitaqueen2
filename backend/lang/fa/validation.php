<?php

// Persian messages for the rules used by the public forms and admin panel.
// Any rule missing here falls back to the English message (APP_FALLBACK_LOCALE).
return [
    'array' => ':attribute باید آرایه باشد.',
    'boolean' => ':attribute باید درست یا نادرست باشد.',
    'date' => ':attribute تاریخ معتبر نیست.',
    'email' => ':attribute باید یک ایمیل معتبر باشد.',
    'exists' => ':attribute انتخاب‌شده معتبر نیست.',
    'file' => ':attribute باید یک فایل باشد.',
    'in' => ':attribute انتخاب‌شده معتبر نیست.',
    'integer' => ':attribute باید عدد صحیح باشد.',
    'max' => [
        'numeric' => ':attribute نباید بزرگ‌تر از :max باشد.',
        'file' => 'حجم :attribute نباید بیشتر از :max کیلوبایت باشد.',
        'string' => ':attribute نباید بیشتر از :max کاراکتر باشد.',
        'array' => ':attribute نباید بیش از :max آیتم داشته باشد.',
    ],
    'mimes' => ':attribute باید یکی از فرمت‌های :values باشد.',
    'min' => [
        'numeric' => ':attribute نباید کوچک‌تر از :min باشد.',
        'file' => 'حجم :attribute نباید کمتر از :min کیلوبایت باشد.',
        'string' => ':attribute نباید کمتر از :min کاراکتر باشد.',
        'array' => ':attribute نباید کمتر از :min آیتم داشته باشد.',
    ],
    'numeric' => ':attribute باید عدد باشد.',
    'prohibited' => 'ارسال :attribute مجاز نیست.',
    'regex' => 'قالب :attribute معتبر نیست.',
    'required' => 'وارد کردن :attribute الزامی است.',
    'required_without' => 'وقتی :values وارد نشده، :attribute الزامی است.',
    'string' => ':attribute باید متن باشد.',
    'unique' => ':attribute قبلاً استفاده شده است.',
    'attributes' => [
        'email' => 'ایمیل',
        'password' => 'رمز عبور',
        'phone' => 'شماره تماس',
        'name' => 'نام',
        'subject' => 'موضوع',
        'slug' => 'نامک (slug)',
    ],
];
