<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\LoginRequest;
use App\Http\Resources\UserResource;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    private const MAX_ATTEMPTS = 5;

    public function login(LoginRequest $request): JsonResponse
    {
        $key = 'admin-login:'.Str::lower($request->input('email')).'|'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            throw ValidationException::withMessages([
                'email' => __('auth.throttle', ['seconds' => RateLimiter::availableIn($key)]),
            ])->status(429);
        }

        $user = User::query()->where('email', Str::lower($request->input('email')))->first();

        // Always run a hash check to keep response time constant (user enumeration).
        $valid = Hash::check($request->input('password'), $user?->password ?? '$2y$12$'.str_repeat('a', 53));

        if (! $user || ! $valid || ! $user->is_active) {
            RateLimiter::hit($key, 15 * 60);

            throw ValidationException::withMessages(['email' => __('auth.failed')]);
        }

        RateLimiter::clear($key);

        $user->forceFill(['last_login_at' => now()])->saveQuietly();
        $token = $user->createToken(
            $request->input('device_name', 'admin-panel'),
            ['*'],
            now()->addMinutes((int) config('sanctum.expiration', 480)),
        );

        auth()->setUser($user);
        ActivityLog::record('login', $user);

        return response()->json([
            'token' => $token->plainTextToken,
            'expires_at' => $token->accessToken->expires_at?->toIso8601String(),
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request): UserResource
    {
        return new UserResource($request->user());
    }

    public function logout(Request $request): JsonResponse
    {
        ActivityLog::record('logout', $request->user());
        $request->user()->currentAccessToken()?->delete();

        return response()->json(null, 204);
    }
}
