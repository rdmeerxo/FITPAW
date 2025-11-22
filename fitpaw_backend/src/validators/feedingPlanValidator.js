import { validate, requireNumber } from '../utils/validation.js';

export function validateFeedingPlan(body) {
  const { foods, rer, mealsPerDay } = body;
  const errors = []; // Fixed: was 'error'

  // Validate RER
  if (!rer || typeof rer !== 'number' || rer <= 0) {
    errors.push('rer must be a positive number');
  }

  // Validate mealsPerDay
  if (!mealsPerDay || typeof mealsPerDay !== 'number' || mealsPerDay < 1 || mealsPerDay > 12) {
    errors.push('mealsPerDay must be between 1 and 12');
  }

  // Validate foods array
  if (!Array.isArray(foods) || foods.length === 0) {
    errors.push('foods must be a non-empty array');
  } else {
    foods.forEach((food, index) => {
      if (!food.caloriesPer100g || food.caloriesPer100g <= 0) { // Fixed
        errors.push(`foods[${index}].caloriesPer100g must be > 0`); // Fixed: backticks
      }
      if (food.percentage === undefined || food.percentage < 0 || food.percentage > 100) {
        errors.push(`foods[${index}].percentage must be between 0 and 100`); // Fixed: backticks
      }
    });
  }

  return errors;
}