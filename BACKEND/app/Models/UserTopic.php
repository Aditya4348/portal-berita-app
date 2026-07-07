<?php

namespace App\Models;

use App\Enums\TopicStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Table('user_topics')]
#[Fillable(['user_id', 'topic_prompt', 'status'])]
class UserTopic extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function sourceWebsites(): HasMany
    {
        return $this->hasMany(SourceWebsite::class, 'topic_id');
    }

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'status' => TopicStatus::class,
        ];
    }
}
