<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;

#[Table('source_websites')]
#[Fillable(['topic_id', 'site_name', 'target_url'])]
class SourceWebsite extends Model
{
    public function topic(): BelongsTo
    {
        return $this->belongsTo(UserTopic::class, 'topic_id');
    }

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
