export interface RateLimitConfig {
	capacity: number;
	refillPerSec: number;
}

export interface RateLimitResult {
	ok: boolean;
	retryAfter: number;
}

interface RateLimitBucket {
	tokens: number;
	updated: number;
}

export type { RateLimitBucket };
