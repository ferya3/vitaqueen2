<?php

namespace App\Http\Resources;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleResource extends BaseResource
{
    /** Set to false for list endpoints so the (large) body is omitted. */
    public bool $withBody = true;

    /**
     * Resolve a list of articles without their body (for listings / cards).
     *
     * @param  iterable<Article>  $articles
     */
    public static function summaries(iterable $articles, Request $request): array
    {
        $out = [];
        foreach ($articles as $article) {
            $resource = new self($article);
            $resource->withBody = false;
            $out[] = $resource->resolve($request);
        }

        return $out;
    }

    public function toArray(Request $request): array
    {
        $admin = $this->isAdmin();

        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'type' => $this->type,
            'title' => $this->t('title'),
            'excerpt' => $this->t('excerpt'),
            'body' => $this->when($this->withBody || $admin, fn () => $this->t('body')),
            'cover_url' => $this->fileUrl($this->cover_path),
            'cover_path' => $this->when($admin, $this->cover_path),
            'author' => $this->whenLoaded('author', fn () => $this->author?->name),
            'is_published' => $this->when($admin, $this->is_published),
            'published_at' => $this->published_at?->toIso8601String(),
            'reading_minutes' => max(1, (int) ceil(mb_strlen(strip_tags((string) $this->translate('body'))) / 1200)),
            'meta_title' => $this->t('meta_title'),
            'meta_description' => $this->t('meta_description'),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
