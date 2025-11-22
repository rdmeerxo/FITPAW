export function calculateCalories(weightKg, neutered, age, goal) {
	const rer = 70 * Math.pow(weightKg, 0.75);

	//converting age to months if needed 
  	const ageInMonths = age * 12;

	let dailyNeeds;
	let baselineFactor;

	if (ageInMonths <= 4) {
		//kitten 0-4monthsold
		dailyNeeds = 2.5 * rer;
		baselineFactor = 2.5;
	} else if (ageInMonths <= 12) {
		//kitten 4-12monthsold
		dailyNeeds = 2.0 * rer;
		baselineFactor = 2.0;
	} else {
		//adultccats consider neuter condition
		baselineFactor= neutered ? 1.2 : 1.4;
		dailyNeeds = baselineFactor * rer;
	}

	//weight goal
	const weightLoss = 0.8 * rer;
	const weightGain = 1.8 * rer;

	return {
		rer: Number(rer.toFixed(0)),
		baselineFactor,
		caloriesPerDay: Math.round(dailyNeeds),
		weightLossCalories: Math.round(weightLoss),
		weightGainCalories: Math.round(weightGain),
		goal: goal || 'none'
	};
}
	