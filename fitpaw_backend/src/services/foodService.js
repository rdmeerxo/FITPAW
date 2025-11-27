import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Domain-specific error class
class DomainError extends Error {
	constructor(message, status = 500, code = 'ERROR') {
		super(message);
		this.status = status;
		this.code = code;
	}
}

// API endpoints
const PRODUCT_API_V2_BASE = 'https://world.openfoodfacts.org/api/v2/product';
const PRODUCT_API_V0_BASE = 'https://world.openfoodfacts.org/api/v0/product';

// Cache
const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 10;
const negativeCache = new Map();
const NEGATIVE_CACHE_TTL_MS = 1000 * 60 * 2;

// Load local cat foods database
let localDatabase = { foods: [] };
try {
	const dbPath = path.join(__dirname, '../../data/catfoods.json');
	const dbContent = fs.readFileSync(dbPath, 'utf-8');
	localDatabase = JSON.parse(dbContent);
	console.log(`Loaded ${localDatabase.foods.length} cat foods from local database`);
} catch (err) {
	console.warn('Could not load local cat foods database:', err.message);
}

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

// Search local database first
function searchLocalDatabase(barcode) {
	const food = localDatabase.foods.find(f => f.barcode === barcode);
	if (food) {
		console.log(`Found in local database: ${food.productName}`);
		return {
			barcode: food.barcode,
			productName: food.productName,
			brands: food.brands,
			categories: food.categories,
			energyKcalPer100g: food.energyKcalPer100g,
			servingSize: food.servingSize || null,
			servingSizeGrams: food.servingSizeGrams || null,
			kcalPerGram: food.kcalPerGram,
			image: food.image || null,
			source: 'local'
		};
	}
	return null;
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

	// CHECK LOCAL DATABASE FIRST
	const localFood = searchLocalDatabase(barcode);
	if (localFood) {
		setCache(barcode, localFood);
		return localFood;
	}

	// Fallback to Open Food Facts API
	console.log(`Not in local database, checking Open Food Facts for: ${barcode}`);
	let json = await fetchProduct(`${PRODUCT_API_V2_BASE}/${barcode}.json`);
	if (!json && json !== false) {
		throw new DomainError('Unexpected upstream response', 502, 'UPSTREAM_ERROR');
	}
	if (json === false) {
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
	let res;
	try {
		res = await fetch(url, { headers: { 'User-Agent': 'CatHealthApp/1.0' } });
	} catch (err) {
		throw new DomainError('Network error contacting Open Food Facts', 502, 'NETWORK_ERROR');
	}
	if (res.status === 404) return false;
	if (!res.ok) {
		throw new DomainError(`Upstream request failed: ${res.status}`, 502, 'UPSTREAM_ERROR');
	}
	try {
		return await res.json();
	} catch (err) {
		throw new DomainError('Failed to parse upstream JSON', 502, 'UPSTREAM_PARSE_ERROR');
	}
}

function safeNumber(v) {
	const n = Number(v);
	return Number.isFinite(n) ? n : null;
}

function parseServingSize(str) {
	if (!str) return null;
	const gramMatch = str.match(/(\d+(?:\.\d+)?)\s*g/i);
	if (gramMatch) return safeNumber(gramMatch[1]);
	const parenMatch = str.match(/\((\d+(?:\.\d+)?)\s*g\)/i);
	if (parenMatch) return safeNumber(parenMatch[1]);
	return null;
}