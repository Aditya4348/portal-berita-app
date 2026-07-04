<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Table('articles')]
#[Fillable(['source_website_id', 'title', 'original_url', 'ai_summary', 'audio_url', 'image_url', 'published_at'])]
class Article extends Model
{
    public function sourceWebsite(): BelongsTo
    {
        return $this->belongsTo(SourceWebsite::class);
    }

    public function chats(): HasMany
    {
        return $this->hasMany(ArticleChat::class);
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }
}
