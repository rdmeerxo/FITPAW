import { calculateCalories } from './calorieService.js';

export function computeFeedingPlan({
  foods, //array of {name, kcal/100,% }
  rer, //required RER value
  mealsPerDay,
}) {
  if (!foods || foods.length === 0) {
    throw new Error('At least one food is required');
  }
  if (!rer || rer <= 0) {
    throw new Error('Valid RER is required');
  }
  if (mealsPerDay < 1 || mealsPerDay > 12) {
    throw new Error('mealsPerDay must be between 1 and 12');
  }

  //total % = 100
  const totalPercentage = foods.reduce((sum, food) => sum + (food.percentage || 0), 0);
  if (Math.abs(totalPercentage - 100) > 0.1) {
    throw new Error('Food percentages must sum to 100');
  }

  //calculating portions for each food
  const portionResults = foods.map(food => {
    if (food.caloriesPer100g <= 0) {
      throw new Error(`Invalid calories for food: ${food.name}`);
    }

    // k_i = kcal per gram
    const k_i = food.caloriesPer100g / 100;

    // c_i = total kcal from this food
    const c_i = (food.percentage / 100) * rer;

    // x_i = grams per day
    const x_i = c_i / k_i;

    // grams per meal
    const gramsPerMeal = Math.round(x_i / mealsPerDay);

    return {
      name: food.name || 'Food',
      gramsPerMeal: gramsPerMeal
    };
  });

  return {
    rer: Math.round(rer),
    mealsPerDay,
    totalFoodTypes: foods.length,
    portions: portionResults,
    note: 'These values are based on daily energy needs. Adjust as needed for your cat\'s appetite and activity.'
  };
}
