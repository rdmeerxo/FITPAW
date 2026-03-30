export function securityHeaders(req, res, next) {
	res.setHeader('X-Content-Type-Options', 'nosniff');
	res.setHeader('X-Frame-Options', 'DENY');
	res.setHeader('X-XSS-Protection', '1; mode=block');
	res.setHeader('Referrer-Policy', 'no-referrer');

	res.setHeader(
		'Content-Security-Policy',
		"default-src 'self'; frame-ancestors 'none'; script-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline'",
	);
	next();
}
