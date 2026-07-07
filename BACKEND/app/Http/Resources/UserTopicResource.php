<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\JsonApiResource;

class UserTopicResource extends JsonApiResource
{
    /**
     * @return array<string, mixed>
     */
    public function toAttributes(Request $request): array
    {
        return [
            'topic_prompt' => $this->topic_prompt,
            'status' => $this->status,
            'created_at' => $this->created_at?->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
            'updated_at' => $this->updated_at?->utc()->format('Y-m-d\\TH:i:s.v\\Z'),
        ];
    }
}
