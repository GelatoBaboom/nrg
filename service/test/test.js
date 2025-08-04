import assert from 'assert';
import { calculateAll, loadCities } from '../index.js';

process.env.OFFLINE = '1';

const cities = loadCities();
const results = await calculateAll();
assert(Array.isArray(results) && results.length > 0, 'Should return results');
assert(results[0].energy > 0, 'Energy should be positive');
assert(results[0].energy <= cities[0].peakConsumption, 'Should not exceed peak consumption');
console.log('Tests passed');
