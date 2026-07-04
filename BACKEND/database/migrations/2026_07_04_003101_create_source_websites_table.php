<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('source_websites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('topic_id')->constrained('user_topics')->cascadeOnDelete();
            $table->string('site_name');
            $table->text('target_url');
            $table->timestamps();

            $table->index(['topic_id', 'site_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('source_websites');
    }
};
