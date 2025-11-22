# Cat Health Backend (Node.js / Express)

Minimal Express API (ES modules) for cat health calculations.

## Endpoints

### POST /api/bmi/calculate

Body: `{ "ribCage": number, "legLength": number }`
Formula: bmi = (ribCage / legLength) - 0.7
Categories (assumed): <1 underweight, 1-<1.4 normal, 1.4-<1.8 overweight, >=1.8 obese.
Response: `{ "bmi": number, "category": string }`

### POST /api/calorie/calculate

Body: `{ "weightKg": number, "neutered": boolean, "age": number, "goal": "weight_loss"|"weight_gain"|"none" }`
RER = 70 * (weightKg ^ 0.75)
Baseline factor: neutered 1.2, intact 1.4
Goal modifiers: weight_loss 0.8, weight_gain 1.2, none 1.0
Age: <1 year factor = 2.5 override; >=7 years additional *1.1
Response: breakdown with caloriesPerDay.

### POST /api/age/convert

Body: `{ "catAgeYears": number }`
Mapping: 1y=15 human, 2y=24 human, each +4 thereafter.
Response: `{ "humanAge": number }`

### GET /api/food/lookup/:barcode

Return normalized nutrition from Open Food Facts.
Response: `{ "barcode", "productName", "brands", "energyKcalPer100g", "kcalPerGram", "servingSize", "servingSizeGrams", "image" }`

### POST /api/feeding-plan/calculate

Body: `{ "barcode"?: string, "manualKcalPerGram"?: number, "weightKg": number, "neutered": boolean, "age": number, "goal": "weight_loss"|"weight_gain"|"none"|"maintain", "mealsPerDay": 1-12, "activityLevel": "low"|"normal"|"high", "foodType": "dry"|"wet"|"mixed" }`
Provide either a valid `barcode` (6–14 digits) or a positive `manualKcalPerGram` (<20). If barcode is supplied but product is not found and `manualKcalPerGram` is present, the service falls back to manual calories.
Maps `goal=maintain` internally to `none` for calorie base.
Response: `{ product, factors, dailyCalories, mealsPerDay, gramsPerDay, gramsPerMeal, schedule: [{time, grams}], notes, fallback? }` where `fallback` appears if manualKcalPerGram was used.

## Validation

Custom lightweight validators; JSON 400 with error details.

## Security & Middleware

- CORS enabled
- Basic security headers set manually
- JSON body limited to 10kb
- Rate limit: 60 requests / 60s per IP
- Structured JSON error responses

## Run

```bash
npm install
npm start
```

## Notes

Factors and thresholds are assumptions; adjust as domain knowledge improves. Feeding plan schedule is a simple evenly spaced placeholder. Add persistence later for caching beyond in-memory.

## Full API Documentation

See `docs/API.md` for human-friendly endpoint details and `docs/openapi.yaml` for machine-readable OpenAPI 3.0 spec (frontend code generation / testing).

### Feeding Plan Logic Summary

1. Nutrition source: barcode lookup (Open Food Facts) OR manualKcalPerGram fallback.
2. Convert to `kcalPerGram` (either from API energy-kcal_100g / 100 or manual value) then compute baseline calories via existing RER factors.
3. Apply activity multiplier (low 0.9, normal 1.0, high 1.1).
4. Derive `gramsPerDay = dailyCalories / kcalPerGram`.
5. Split by `mealsPerDay` producing `gramsPerMeal` and schedule.
6. Attach food type notes (hydration/energy density hints).
7. If manual fallback used, response includes `fallback` field documenting mode.
