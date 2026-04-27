// human age converter for cats
// Table assumptionworks like year1=15, year2=+9, subsequent=+4 each
export function convertCatAge(catAgeYears) {
	if (catAgeYears <= 0) return { humanAge: 0 };
	let humanAge;
	if (catAgeYears === 1) humanAge = 15;
	else if (catAgeYears === 2) humanAge = 15 + 9;
	else humanAge = 15 + 9 + (catAgeYears - 2) * 4;
	return { humanAge };
}
