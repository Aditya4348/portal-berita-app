<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArticleChatRequest;
use App\Http\Resources\ArticleChatResource;
use App\Models\Article;
use App\Models\ArticleChat;

class ArticleChatController extends Controller
{
    public function store(StoreArticleChatRequest $request, Article $article): ArticleChatResource
    {
        $chat = ArticleChat::query()->create([
            'user_id' => $request->user()->getKey(),
            'article_id' => $article->getKey(),
            'sender_type' => 'user',
            'message' => $request->validated('message'),
        ]);

        return new ArticleChatResource($chat);
    }
}
