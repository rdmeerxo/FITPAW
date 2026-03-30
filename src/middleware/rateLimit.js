// Simple in-memory IP rate limiter
const buckets = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

export function rateLimit(req, res, next) {
	const now = Date.now();
	const ip = req.ip || 'unknown';
	let bucket = buckets.get(ip);
	if (!bucket || now - bucket.start >= WINDOW_MS) {
		bucket = { start: now, count: 0 };
		buckets.set(ip, bucket);
	}
	bucket.count += 1;
	if (bucket.count > MAX_REQUESTS) {
		return res
			.status(429)
			.json({
				error: {
					message: 'Rate limit exceeded',
					retryAfterSeconds: Math.ceil((bucket.start + WINDOW_MS - now) / 1000),
				},
			});
	}
	next();
}
