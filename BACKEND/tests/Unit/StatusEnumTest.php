<?php

use App\Enums\ArticleProcessingStatus;
use App\Enums\TopicStatus;
use App\Models\Article;
use App\Models\UserTopic;

it('defines the complete topic lifecycle', function () {
    expect(array_column(TopicStatus::cases(), 'value'))->toBe([
        'pending',
        'active',
        'failed',
    ]);
});

it('defines the complete article processing lifecycle', function () {
    expect(array_column(ArticleProcessingStatus::cases(), 'value'))->toBe([
        'received',
        'processing',
        'ready',
        'failed',
    ]);
});

it('casts model statuses to enums', function () {
    $topic = new UserTopic(['status' => 'pending']);
    $article = new Article(['processing_status' => 'received']);

    expect($topic->status)->toBe(TopicStatus::Pending)
        ->and($article->processing_status)->toBe(ArticleProcessingStatus::Received);
});
