<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTopicRequest;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\UserTopicResource;
use App\Models\Article;
use App\Models\UserTopic;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\JsonApi\AnonymousResourceCollection;

class NewsController extends Controller
{
    public function storeTopic(StoreTopicRequest $request): UserTopicResource
    {
        $topic = UserTopic::query()->create([
            'user_id' => $request->user()->getKey(),
            'topic_prompt' => $request->validated('topic_prompt'),
            'status' => 'pending',
        ]);

        return new UserTopicResource($topic);
    }

    public function feed(Request $request): AnonymousResourceCollection
    {
        $articles = Article::query()
            ->whereHas('sourceWebsite.topic', function (Builder $query) use ($request): void {
                $query->where('user_id', $request->user()->getKey());
            })
            ->latest('published_at')
            ->paginate(20);

        return ArticleResource::collection($articles);
    }

    public function show(Article $article): ArticleResource
    {
        return new ArticleResource($article);
    }
}
