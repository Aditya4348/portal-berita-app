<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;

final class ApiErrorResponse
{
    /** @param array<int, array<string, mixed>> $errors */
    public static function make(array $errors, int $status): JsonResponse
    {
        return response()->json(
            ['errors' => $errors],
            $status,
            ['Content-Type' => 'application/vnd.api+json'],
        );
    }

    /** @return array<string, mixed> */
    public static function error(
        int $status,
        string $code,
        string $title,
        string $detail,
        ?string $pointer = null,
    ): array {
        return array_filter([
            'status' => (string) $status,
            'code' => $code,
            'title' => $title,
            'detail' => $detail,
            'source' => $pointer === null ? null : ['pointer' => $pointer],
        ], static fn (mixed $value): bool => $value !== null);
    }
}
