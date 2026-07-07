<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

class ArticleResource extends JsonApiResource
{
    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Request $request): array
    {
        return [
            'source_website_id' => $this->source_website_id,
            'title' => $this->title,
            'original_url' => $this->original_url,
            'ai_summary' => $this->ai_summary,
            'audio_url' => $this->audio_url,
            'image_url' => $this->image_url,
            'published_at' => $this->published_at?->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
            'created_at' => $this->created_at?->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
            'updated_at' => $this->updated_at?->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
        ];
    }
}
