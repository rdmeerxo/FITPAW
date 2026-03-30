export function notFound(req, res, next) {
	res.status(404).json({ error: { message: 'Not found' } });
}

export function errorHandler(err, req, res, next) {
	// eslint-disable-line no-unused-vars
	console.error(err);
	const status = err.status || 500;
	res
		.status(status)
		.json({ error: { message: err.message || 'Internal server error' } });
}
