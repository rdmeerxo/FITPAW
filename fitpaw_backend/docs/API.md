# Cat Health API Documentation

Base URL (dev): `http://localhost:3000`
All responses are JSON. Send requests with `Content-Type: application/json` for bodies.

## Authentication

Currently none. (Future: API key / JWT.)

## Common Error Format

```
{
  "error": {
    "message": "Human-readable summary",
    "details": ["optional", "array", "of", "validation", "issues"],
    "code": "OPTIONAL_ERROR_CODE"
  }
}
```

`code` appears for domain / upstream errors (e.g. PRODUCT_NOT_FOUND, NETWORK_ERROR) when thrown by services. Validation errors include a `details` array.

## Rate Limiting

60 requests per 60 seconds per IP. Exceeding may return HTTP 429 (future enhancement). Currently unspecified error message uses standard format.

## Endpoints Overview

| Endpoint                    | Method | Purpose                                                     |
| --------------------------- | ------ | ----------------------------------------------------------- |
| /api/bmi/calculate          | POST   | Compute feline BMI & category                               |
| /api/calorie/calculate      | POST   | Daily calorie needs                                         |
| /api/age/convert            | POST   | Cat age -> human age                                        |
| /api/food/lookup/:barcode   | GET    | Fetch product nutrition by barcode (Open Food Facts)        |
| /api/feeding-plan/calculate | POST   | Personalized feeding plan (supports barcode or manual kcal) |

---

## 1. BMI

### Request

`POST /api/bmi/calculate`

```
{
  "ribCage": 35,
  "legLength": 30
}
```

Validation: ribCage > 0, legLength > 0.

### Response

```
{
  "bmi": 0.4667,
  "category": "normal"
}
```

### Errors

400 if missing/invalid fields.

---

## 2. Calorie

### Request

`POST /api/calorie/calculate`

```
{
  "weightKg": 4.5,
  "neutered": true,
  "age": 3,
  "goal": "none"
}
```

Goal enum: `weight_loss | weight_gain | none`. (Frontend may show `maintain` mapped internally to `none`.)

### Response (example)

```
{
  "weightKg": 4.5,
  "neutered": true,
  "age": 3,
  "goal": "none",
  "rer": 302.41,
  "baselineFactor": 1.2,
  "goalModifier": 1.0,
  "ageAdjustment": 1.0,
  "totalFactor": 1.2,
  "caloriesPerDay": 363
}
```

### Errors

400 validation errors.

---

## 3. Age Convert

### Request

`POST /api/age/convert`

```
{ "catAgeYears": 7 }
```

### Response

```
{ "humanAge": 44 }
```

### Rules

1y=15, 2y=24, each additional year +4.

---

## 4. Food Lookup

### Request

`GET /api/food/lookup/:barcode`
Example: `/api/food/lookup/3182550402017`
Barcode must be 6–14 digits.

### Successful Response

```
{
  "barcode": "3182550402017",
  "productName": "Sample Cat Food",
  "brands": "BrandX",
  "categories": "Pets,Cat food",
  "energyKcalPer100g": 350,
  "servingSize": "85 g",
  "servingSizeGrams": 85,
  "kcalPerGram": 3.5,
  "image": "https://.../image.jpg",
  "source": "api"
}
```

### 404 Not Found

```
{
  "error": { "message": "Product not found", "code": "PRODUCT_NOT_FOUND" }
}
```

### Other Errors

502 for upstream/network issues with `code` like `NETWORK_ERROR`, `UPSTREAM_ERROR`.

---

## 5. Feeding Plan

`POST /api/feeding-plan/calculate`
Supports two nutrition sourcing modes:

1. Barcode lookup via Open Food Facts
2. Manual fallback (provide `manualKcalPerGram`)

You MUST provide either a valid barcode OR a positive `manualKcalPerGram` (<20). If barcode lookup fails AND manualKcalPerGram provided, service falls back.

### Request (barcode mode)

```
{
  "barcode": "3182550402017",
  "manualKcalPerGram": 3.5,   // optional (used only if product not found)
  "weightKg": 4.5,
  "neutered": true,
  "age": 3,
  "goal": "none",
  "mealsPerDay": 3,
  "activityLevel": "normal",
  "foodType": "dry"
}
```

### Request (manual-only mode)

```
{
  "manualKcalPerGram": 3.5,
  "weightKg": 4.5,
  "neutered": true,
  "age": 3,
  "goal": "none",
  "mealsPerDay": 4,
  "activityLevel": "high",
  "foodType": "mixed"
}
```

### Response (success, with barcode)

```
{
  "product": {
    "barcode": "3182550402017",
    "name": "Sample Cat Food",
    "kcalPerGram": 3.5,
    "energyKcalPer100g": 350
  },
  "factors": {
    "rer": 302.41,
    "baselineFactor": 1.2,
    "goalModifier": 1.0,
    "ageAdjustment": 1.0,
    "totalFactor": 1.2,
    "activityFactor": 1.0
  },
  "dailyCalories": 363,
  "mealsPerDay": 3,
  "gramsPerDay": 103.7,
  "gramsPerMeal": 34.6,
  "schedule": [
    { "time": "07:00", "grams": 34.6 },
    { "time": "12:00", "grams": 34.6 },
    { "time": "17:00", "grams": 34.6 }
  ],
  "notes": "Dry food: higher energy density; ensure adequate water intake."
}
```

### Response (manual fallback)

```
{
  "product": {
    "barcode": null,
    "name": "Manual Entry",
    "kcalPerGram": 3.5,
    "energyKcalPer100g": 350
  },
  "factors": { ... },
  "dailyCalories": 363,
  "mealsPerDay": 3,
  "gramsPerDay": 103.7,
  "gramsPerMeal": 34.6,
  "schedule": [ ... ],
  "notes": "Dry food: higher energy density; ensure adequate water intake.
  ",
  "fallback": {
    "mode": "manualKcalPerGram",
    "kcalPerGram": 3.5
  }
}
```

### Validation Errors (examples)

- Missing both barcode and manual: 400 with detail `Provide either a valid barcode (6-14 digits) or manualKcalPerGram > 0`
- manualKcalPerGram >= 20: 400 detail `manualKcalPerGram must be > 0 and < 20`
- mealsPerDay not in 1-12: 400 detail `mealsPerDay must be integer 1-12`

### Field Reference

| Field             | Type        | Notes                                              |
| ----------------- | ----------- | -------------------------------------------------- | ----------- | ------------------------------ | -------------------------------------- |
| barcode           | string/null | null when manual fallback used                     |
| manualKcalPerGram | number      | Optional; <20; typical dry foods ~3.2–4.5          |
| activityLevel     | enum        | low                                                | normal      | high (multipliers 0.9,1.0,1.1) |
| foodType          | enum        | dry                                                | wet         | mixed (adds contextual note)   |
| goal              | enum        | weight_loss                                        | weight_gain | none                           | maintain (maintain -> none internally) |
| schedule[]        | array       | Generated times; may be auto-expanded for >4 meals |

---

## Enumerations Summary

- Goal: `weight_loss`, `weight_gain`, `none`, `maintain`
- Activity: `low`, `normal`, `high`
- Food Type: `dry`, `wet`, `mixed`

---

## Upstream Integration Notes (Food Lookup)

- Primary API: v2 `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- Fallback: v0 `https://world.openfoodfacts.org/api/v0/product/{barcode}.json` if v2 404.
- Negative cache: Not-found barcodes cached for 2 minutes to reduce repeat calls.

## Caching

- Product lookups: in-memory positive cache (10 min) & negative cache (2 min).
- No persistent storage; restart clears cache.

## Headers of Interest

Currently only custom `User-Agent` when calling Open Food Facts from server side. No auth headers inbound.

## Versioning

Unversioned base path presently (`/api`). Future extension: `/api/v1` when breaking changes appear.

## Sample Integration Flow (Frontend)

1. GET product via barcode scan `/api/food/lookup/{barcode}`.
2. If 404, prompt user for manual kcal/gram entry.
3. POST feeding plan with either barcode or manualKcalPerGram.
4. Render schedule times + grams.
5. Offer recalculation if activity/goal changes.

## Error Codes (non-validation)

| Code                 | Meaning                           |
| -------------------- | --------------------------------- |
| INVALID_BARCODE      | Bad barcode format                |
| PRODUCT_NOT_FOUND    | Upstream product missing          |
| NETWORK_ERROR        | Network failure reaching upstream |
| UPSTREAM_ERROR       | Non-404 error from upstream       |
| UPSTREAM_PARSE_ERROR | JSON parse failure from upstream  |

## Future Enhancements (Suggested)

- Add OpenAPI tags & security schemes when auth introduced.
- Persist user-specific meal adjustments.
- Multi-language error messages (EN/MN).
- Add `ETag` / conditional requests for product data.

## Health Check (Potential Addition)

A simple `GET /api/health` could return `{ "status": "ok", "uptime": seconds }` (not yet implemented).

---

## Changelog (Recent)

- Added manual kcal fallback for feeding plan.
- Added error code propagation via DomainError.
- Enhanced Postman collection with manual & fallback tests.

---

## OpenAPI Specification

See `openapi.yaml` in the same directory for machine-readable schema.
