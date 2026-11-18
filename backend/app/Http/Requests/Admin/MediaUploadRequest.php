<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Translatable;

class MediaUploadRequest extends AdminRequest
{
    public function rules(): array
    {
        $cfg = config('aqua.uploads');
        $mimes = implode(',', array_merge($cfg['image_mimes'], $cfg['document_mimes'], $cfg['video_mimes']));
        $max = max($cfg['max_image_kb'], $cfg['max_document_kb'], $cfg['max_video_kb']);

        return array_merge(Translatable::rules('alt', false, 200), [
            'file' => ['required', 'file', "mimes:{$mimes}", "max:{$max}"],
            'collection' => ['nullable', 'string', 'max:50', 'alpha_dash'],
        ]);
    }

    public function after(): array
    {
        return [function ($validator) {
            $file = $this->file('file');
            if (! $file) {
                return;
            }
            $cfg = config('aqua.uploads');
            $ext = strtolower($file->getClientOriginalExtension());
            $kb = $file->getSize() / 1024;
            $limit = match (true) {
                in_array($ext, $cfg['image_mimes'], true) => $cfg['max_image_kb'],
                in_array($ext, $cfg['document_mimes'], true) => $cfg['max_document_kb'],
                default => $cfg['max_video_kb'],
            };
            if ($kb > $limit) {
                $validator->errors()->add('file', "File is too large (max {$limit} KB for this type).");
            }
        }];
    }
}
