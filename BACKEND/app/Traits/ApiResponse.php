<?php

namespace App\Traits;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

trait ApiResponse
{
    /**
     * Build a success response.
     */
    protected function successResponse(mixed $data, int $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'data' => $data,
        ], $code);
    }

    /**
     * Build an error response.
     */
    protected function errorResponse(string $message, int $code): JsonResponse
    {
        return response()->json([
            'errors' => [
                [
                    'status' => (string) $code,
                    'title' => 'Error',
                    'detail' => $message,
                ],
            ],
        ], $code);
    }

    /**
     * Build a paginated response.
     */
    protected function paginatedResponse(LengthAwarePaginator $paginator, int $code = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'data' => $paginator->items(),
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'from' => $paginator->firstItem(),
                'last_page' => $paginator->lastPage(),
                'path' => $paginator->path(),
                'per_page' => $paginator->perPage(),
                'to' => $paginator->lastItem(),
                'total' => $paginator->total(),
            ],
        ], $code);
    }
}
