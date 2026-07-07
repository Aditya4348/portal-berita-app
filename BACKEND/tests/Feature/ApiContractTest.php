<?php

use App\Http\Resources\UserTopicResource;
use App\Models\UserTopic;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

beforeEach(function (): void {
    Route::get('/api/_contract/topic', function () {
        $topic = new UserTopic([
            'topic_prompt' => 'Perkembangan AI di Indonesia',
            'status' => 'active',
        ]);
        $topic->id = 12;
        $topic->created_at = Carbon::parse('2026-07-08 03:15:30', 'UTC');
        $topic->updated_at = Carbon::parse('2026-07-08 03:15:30', 'UTC');

        return new UserTopicResource($topic);
    });

    Route::get('/api/_contract/topics', function () {
        $topic = new UserTopic([
            'topic_prompt' => 'Perkembangan AI di Indonesia',
            'status' => 'active',
        ]);
        $topic->id = 12;

        $paginator = new LengthAwarePaginator(
            [$topic],
            41,
            20,
            1,
            ['path' => url('/api/_contract/topics')],
        );

        return UserTopicResource::collection($paginator);
    });

    Route::post('/api/_contract/validation', function (): never {
        throw ValidationException::withMessages([
            'topic_prompt' => ['The topic prompt field is required.'],
        ]);
    });

    Route::get('/api/_contract/failure', function (): never {
        abort(404);
    });
});

it('returns a successful JSON API resource with an ISO 8601 UTC date', function () {
    $response = $this->getJson('/api/_contract/topic', [
        'Accept' => 'application/vnd.api+json',
    ]);

    $response
        ->assertOk()
        ->assertHeader('Content-Type', 'application/vnd.api+json')
        ->assertExactJson([
            'data' => [
                'id' => '12',
                'type' => 'user_topics',
                'attributes' => [
                    'topic_prompt' => 'Perkembangan AI di Indonesia',
                    'status' => 'active',
                    'created_at' => '2026-07-08T03:15:30.000Z',
                    'updated_at' => '2026-07-08T03:15:30.000Z',
                ],
            ],
        ]);
});

it('returns pagination links and metadata', function () {
    $response = $this->getJson('/api/_contract/topics', [
        'Accept' => 'application/vnd.api+json',
    ]);

    $response
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('links.first', 'http://localhost/api/_contract/topics?page=1')
        ->assertJsonPath('links.next', 'http://localhost/api/_contract/topics?page=2')
        ->assertJsonPath('meta.current_page', 1)
        ->assertJsonPath('meta.per_page', 20)
        ->assertJsonPath('meta.total', 41);
});

it('returns validation failures as JSON API errors', function () {
    $response = $this->postJson('/api/_contract/validation');

    $response
        ->assertUnprocessable()
        ->assertHeader('Content-Type', 'application/vnd.api+json')
        ->assertExactJson([
            'errors' => [[
                'status' => '422',
                'code' => 'VALIDATION_FAILED',
                'title' => 'Validation failed',
                'detail' => 'The topic prompt field is required.',
                'source' => ['pointer' => '/data/attributes/topic_prompt'],
            ]],
        ]);
});

it('returns application failures as JSON API errors', function () {
    $response = $this->getJson('/api/_contract/failure');

    $response
        ->assertNotFound()
        ->assertHeader('Content-Type', 'application/vnd.api+json')
        ->assertExactJson([
            'errors' => [[
                'status' => '404',
                'code' => 'RESOURCE_NOT_FOUND',
                'title' => 'Resource not found',
                'detail' => 'The requested resource was not found.',
            ]],
        ]);
});

it('uses UTC as the application timezone', function () {
    expect(config('app.timezone'))->toBe('UTC');
});
