// Service to fetch cat food nutritional data using Open Food Facts API
// Provides basic caching to reduce repeated outbound requests.
// Exposes fetchFoodByBarcode(barcode) which returns normalized nutrition.

import fetch from 'node-fetch';

// Domain-specific error class allowing HTTP status mapping.
class DomainError extends Error {
	constructor(message, status = 500, code = 'ERROR') {
		super(message);
		this.status = status;
		this.code = code;
	}
}

// API endpoints for product detail. We'll try v2 first, then fallback to v0 if 404.
const PRODUCT_API_V2_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const PRODUCT_API_V0_BASE = 'https://world.openfoodfacts.org/api/v0/product';

// Positive cache (barcode -> normalized product) with TTL (ms)
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes
// Negative cache to avoid repeated misses (barcode -> true) with shorter TTL
const negativeCache = new Map();
const NEGATIVE_CACHE_TTL_MS = 1000 * 60 * 2; // 2 minutes

function setCache(barcode, value) {
	cache.set(barcode, { value, expires: Date.now() + CACHE_TTL_MS });
}

function getCache(barcode) {
	const entry = cache.get(barcode);
	if (!entry) return null;
	if (Date.now() > entry.expires) {
		cache.delete(barcode);
		return null;
	}
	return entry.value;
}

function setNegativeCache(barcode) {
	negativeCache.set(barcode, { expires: Date.now() + NEGATIVE_CACHE_TTL_MS });
}

function inNegativeCache(barcode) {
	const entry = negativeCache.get(barcode);
	if (!entry) return false;
	if (Date.now() > entry.expires) {
		negativeCache.delete(barcode);
		return false;
	}
	return true;
}

export async function fetchFoodByBarcode(barcode) {
	if (!barcode || !/^[0-9]{6,14}$/.test(barcode)) {
		throw new DomainError('Invalid barcode format', 400, 'INVALID_BARCODE');
	}

	if (inNegativeCache(barcode)) {
		throw new DomainError('Product not found', 404, 'PRODUCT_NOT_FOUND');
	}

	const cached = getCache(barcode);
	if (cached) return { ...cached, source: 'cache' };

	// Attempt v2, fallback to v0 if 404.
	let json = await fetchProduct(`${PRODUCT_API_V2_BASE}/${barcode}.json`);
	if (!json && json !== false) {
		// Unexpected result, treat as network.
		throw new DomainError(
			'Unexpected upstream response',
			502,
			'UPSTREAM_ERROR',
		);
	}
	if (json === false) {
		// v2 returned 404; try v0
		json = await fetchProduct(`${PRODUCT_API_V0_BASE}/${barcode}.json`);
		if (json === false) {
			setNegativeCache(barcode);
			throw new DomainError('Product not found', 404, 'PRODUCT_NOT_FOUND');
		}
	}

	if (!json || json.status !== 1 || !json.product) {
		setNegativeCache(barcode);
		throw new DomainError('Product not found', 404, 'PRODUCT_NOT_FOUND');
	}

	const p = json.product;
	const nutriments = p.nutriments || {};
	const energyKcalPer100g = safeNumber(
		nutriments['energy-kcal_100g'] ?? nutriments['energy-kcal_serving'],
	);
	const servingSizeStr = p.serving_size || '';
	const servingSizeGrams = parseServingSize(servingSizeStr);
	const kcalPerGram = energyKcalPer100g ? energyKcalPer100g / 100 : null;

	const normalized = {
		barcode,
		productName: p.product_name || p.generic_name || 'Unknown',
		brands: p.brands || '',
		categories: p.categories || '',
		energyKcalPer100g: energyKcalPer100g || null,
		servingSize: servingSizeStr || null,
		servingSizeGrams,
		kcalPerGram,
		image: p.image_small_url || p.image_url || null,
		source: 'api',
	};

	setCache(barcode, normalized);
	return normalized;
}

async function fetchProduct(url) {
	// Returns json object, false if 404, null if network failure
	let res;
	try {
		res = await fetch(url, { headers: { 'User-Agent': 'CatHealthApp/1.0' } });
	} catch (err) {
		throw new DomainError(
			'Network error contacting Open Food Facts',
			502,
			'NETWORK_ERROR',
		);
	}
	if (res.status === 404) return false;
	if (!res.ok) {
		throw new DomainError(
			`Upstream request failed: ${res.status}`,
			502,
			'UPSTREAM_ERROR',
		);
	}
	try {
		return await res.json();
	} catch (err) {
		throw new DomainError(
			'Failed to parse upstream JSON',
			502,
			'UPSTREAM_PARSE_ERROR',
		);
	}
}

function safeNumber(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

function parseServingSize(str) {
	if (!str) return null;
	// Attempt to extract grams from patterns like "85 g" or "3 oz (85g)".
	const gramMatch = str.match(/(\d+(?:\.\d+)?)\s*g/i);
	if (gramMatch) return safeNumber(gramMatch[1]);
	// Fallback try parentheses content with g.
	const parenMatch = str.match(/\((\d+(?:\.\d+)?)\s*g\)/i);
	if (parenMatch) return safeNumber(parenMatch[1]);
	return null;
}
