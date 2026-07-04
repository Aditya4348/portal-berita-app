<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

class ArticleChatResource extends JsonApiResource
{
    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Request $request): array
    {
        return [
            'article_id' => $this->article_id,
            'sender_type' => $this->sender_type,
            'message' => $this->message,
            'created_at' => $this->created_at,
        ];
    }
}
