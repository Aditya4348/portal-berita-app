<?php

use App\Enums\ArticleProcessingStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->string('processing_status', 20)
                ->default(ArticleProcessingStatus::Received->value)
                ->index()
                ->after('published_at');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table): void {
            $table->dropColumn('processing_status');
        });
    }
};
