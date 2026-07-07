<?php

use App\Http\Controllers\ArticleChatController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->prefix('v1')->group(function (): void {
    Route::controller(NewsController::class)->group(function (): void {
        Route::post('/topics', 'storeTopic')->name('topics.store');
        Route::get('/feed', 'feed')->name('feed.index');
        Route::get('/articles/{article}', 'show')->name('articles.show');
    });

    Route::post('/articles/{article}/chat', [ArticleChatController::class, 'store'])
        ->name('articles.chat.store');
});
