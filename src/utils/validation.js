export function isNumber(value) {
	return (
		typeof value === 'number' && !Number.isNaN(value) && Number.isFinite(value)
	);
}

export function requireNumber(value, field, { min, max } = {}) {
	if (!isNumber(value)) return `${field} must be a number`;
	if (min !== undefined && value < min) return `${field} must be >= ${min}`;
	if (max !== undefined && value > max) return `${field} must be <= ${max}`;
	return null;
}

export function requireBoolean(value, field) {
	if (typeof value !== 'boolean') return `${field} must be boolean`;
	return null;
}

export function requireEnum(value, field, allowed) {
	if (!allowed.includes(value))
		return `${field} must be one of: ${allowed.join(', ')}`;
	return null;
}

export function validate(payload, rules) {
	const errors = [];
	for (const rule of rules) {
		const msg = rule();
		if (msg) errors.push(msg);
	}
	return errors;
}
