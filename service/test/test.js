import assert from 'assert';
import { calculateAll } from '../index.js';

process.env.OFFLINE = '1';

const results = await calculateAll();
assert(Array.isArray(results) && results.length > 0, 'Should return results');
assert(results[0].energy > 0, 'Energy should be positive');
console.log('Tests passed');
