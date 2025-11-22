export function calculateBmi(ribCageCircumference, legLength) {
	//formula for bmi = (((RC/0.7067) - LIM) / 0.9156) - LIM
	const bmi = (((ribCageCircumference / 0.7067) - legLength) / 0.9156) - legLength;

	let category;
	if (bmi < 15) category = 'underweight';
	else if (bmi < 30) category = 'normal';
	else if (bmi <= 42) category = 'overweight';
	else category = 'obese';
	return { fbmi: Number(bmi.toFixed(2)), category };
}
