<?php

use App\Support\ApiErrorResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (ValidationException $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $errors = collect($exception->errors())
                ->flatMap(function (array $messages, string $field): array {
                    $pointer = '/data/attributes/'.str_replace('.', '/', $field);

                    return array_map(
                        fn (string $message): array => ApiErrorResponse::error(
                            422, 'VALIDATION_FAILED', 'Validation failed', $message, $pointer,
                        ),
                        $messages,
                    );
                })
                ->values()
                ->all();

            return ApiErrorResponse::make($errors, 422);
        });

        $exceptions->render(function (AuthenticationException $exception, Request $request) {
            return $request->is('api/*')
                ? ApiErrorResponse::make([
                    ApiErrorResponse::error(401, 'UNAUTHENTICATED', 'Unauthenticated', 'Authentication is required.'),
                ], 401)
                : null;
        });

        $exceptions->render(function (AuthorizationException $exception, Request $request) {
            return $request->is('api/*')
                ? ApiErrorResponse::make([
                    ApiErrorResponse::error(403, 'FORBIDDEN', 'Forbidden', 'You are not allowed to perform this action.'),
                ], 403)
                : null;
        });

        $exceptions->render(function (ModelNotFoundException $exception, Request $request) {
            return $request->is('api/*')
                ? ApiErrorResponse::make([
                    ApiErrorResponse::error(404, 'RESOURCE_NOT_FOUND', 'Resource not found', 'The requested resource was not found.'),
                ], 404)
                : null;
        });

        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            $status = $exception instanceof HttpExceptionInterface ? $exception->getStatusCode() : 500;

            if ($status === 500) {
                report($exception);
            }

            $definitions = [
                400 => ['BAD_REQUEST', 'Bad request', 'The request could not be processed.'],
                404 => ['RESOURCE_NOT_FOUND', 'Resource not found', 'The requested resource was not found.'],
                405 => ['METHOD_NOT_ALLOWED', 'Method not allowed', 'The HTTP method is not supported for this endpoint.'],
                429 => ['TOO_MANY_REQUESTS', 'Too many requests', 'Too many requests were sent. Please try again later.'],
            ];

            [$code, $title, $detail] = $definitions[$status]
                ?? ['INTERNAL_SERVER_ERROR', 'Internal server error', 'An unexpected error occurred.'];

            return ApiErrorResponse::make([
                ApiErrorResponse::error($status, $code, $title, $detail),
            ], $status);
        });
    })->create();
