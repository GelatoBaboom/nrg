import fs from 'fs';
import { estimateTourists } from './tourism.js';
import { estimateConsumption } from './consumption.js';

/**
 * Fetch current weather data for the given city. When the OFFLINE
 * environment variable is set the values are approximated using the
 * current date instead of making a network request.
 */
export async function fetchWeather(city) {
  if (process.env.OFFLINE) {
    return seasonalWeather(city);
  }

  if (!process.env.WEATHER_API_KEY || !city.latitude || !city.longitude) {
    throw new Error('Missing WEATHER_API_KEY or city coordinates');
  }

  const url =
    `https://weather.googleapis.com/v1/currentConditions:lookup?key=${process.env.WEATHER_API_KEY}` +
    `&location.latitude=${city.latitude}&location.longitude=${city.longitude}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error ${res.status}`);
  }
  const data = await res.json();
  return {
    temperature: data.temperature ?? city.temperature ?? 20,
    daylightHours: data.daylightHours ?? city.daylightHours ?? 12,
    raining: data.conditions?.includes('RAIN') || false,
    snowing: data.conditions?.includes('SNOW') || false,
    freezing: data.temperature <= 0
  };
}

function seasonalWeather(city) {
  const month = new Date().getUTCMonth() + 1;
  const south = city.latitude < 0;
  let season;
  if (south) {
    if (month <= 2 || month === 12) season = 'summer';
    else if (month <= 5) season = 'autumn';
    else if (month <= 8) season = 'winter';
    else season = 'spring';
  } else {
    if (month <= 2 || month === 12) season = 'winter';
    else if (month <= 5) season = 'spring';
    else if (month <= 8) season = 'summer';
    else season = 'autumn';
  }
  const defaults = {
    summer: { temperature: 25, daylightHours: 14 },
    autumn: { temperature: 15, daylightHours: 11 },
    winter: { temperature: 5, daylightHours: 9 },
    spring: { temperature: 18, daylightHours: 12 }
  };
  const info = defaults[season];
  return {
    ...info,
    raining: false,
    snowing: false,
    freezing: info.temperature <= 0
  };
}


export function estimateEnergy(city) {
  let demand = city.baseConsumption;
  demand *= 1 + (city.expectedTourists || 0) / (city.population || 1) * 0.3;
  if (city.temperature > 25 || city.temperature < 5) {
    demand *= 1.2;
  }
  demand *= 12 / city.daylightHours;
  if (city.raining || city.snowing || city.freezing) {
    demand *= 1.1;
  }
  return Math.min(city.peakConsumption, Math.max(city.baseConsumption, demand));
}

export function loadCities() {
  const data = fs.readFileSync(new URL('./cities.json', import.meta.url));
  return JSON.parse(data);
}

export async function calculateCity(city) {
  const weather = await fetchWeather(city);
  const expectedTourists = await estimateTourists(city);
  const consumption = await estimateConsumption(city);
  const data = {
    ...city,
    ...weather,
    ...consumption,
    expectedTourists
  };
  return {
    name: city.name,
    energy: estimateEnergy(data)
  };
}

export async function calculateAll() {
  const cities = loadCities();
  const results = [];
  for (const city of cities) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await calculateCity(city));
  }
  fs.writeFileSync(new URL('./results.json', import.meta.url), JSON.stringify(results, null, 2));
  return results;
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log('Calculating energy consumption...');
  calculateAll().then(r => console.log(r)).catch(err => console.error(err));
}
