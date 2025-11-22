import { validate, requireNumber } from '../utils/validation.js';

export function validateBmi(body) {
	const { ribCageCircumference, legLength } = body;
	const errors = validate(body, [
		() => requireNumber(ribCageCircumference, 'ribCageCircumference', { min: 1 }),
		() => requireNumber(legLength, 'legLength', { min: 1 }),
	]);
	return errors;
}
