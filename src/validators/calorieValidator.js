import {
	validate,
	requireNumber,
	requireBoolean,
	requireEnum,
} from '../utils/validation.js';

const GOALS = ['weight_loss', 'weight_gain', 'none'];

export function validateCalorie(body) {
	const { weightKg, neutered, age, goal } = body;
	const errors = validate(body, [
		() => requireNumber(weightKg, 'weightKg', { min: 0.5 }),
		() => requireBoolean(neutered, 'neutered'),
		() => requireNumber(age, 'age', { min: 0 }),
		() => requireEnum(goal, 'goal', GOALS),
	]);
	return errors;
}
