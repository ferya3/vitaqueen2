<?php

namespace App\Http\Requests\Public;

use App\Support\Digits;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Base for public lead forms: normalizes Persian/Arabic digits, trims input and
 * applies a honeypot ("website" must stay empty) plus a minimum fill time.
 */
abstract class PublicFormRequest extends FormRequest
{
    /** Fields whose digits are normalized to Latin. */
    protected array $numericLike = ['phone'];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $data = [];
        foreach ($this->numericLike as $field) {
            if (is_string($this->input($field))) {
                $data[$field] = preg_replace('/[\s\-()]/', '', Digits::normalize($this->input($field)));
            }
        }
        $this->merge($data);
    }

    protected function spamRules(): array
    {
        return [
            // Honeypot: hidden in the UI; bots fill every field.
            'website' => ['prohibited'],
            // Unix ms timestamp when the form was rendered (optional, checked in after()).
            'form_started_at' => ['nullable', 'integer'],
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            $started = (int) $this->input('form_started_at');
            if ($started > 0 && (now()->getTimestampMs() - $started) < 2000) {
                $validator->errors()->add('form', 'Submitted too quickly. Please try again.');
            }
        }];
    }

    protected function phoneRule(): string
    {
        return 'regex:/^\+?[0-9]{7,15}$/';
    }
}
