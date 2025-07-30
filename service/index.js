import fs from 'fs';

/**
 * Fetch current weather data for the given city. When the OFFLINE
 * environment variable is set the values stored in the configuration
 * file are used instead of making a network request.
 */
export async function fetchWeather(city) {
  if (process.env.OFFLINE) {
    return {
      temperature: city.temperature,
      daylightHours: city.daylightHours,
      raining: false,
      snowing: false,
      freezing: city.temperature <= 0
    };
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
    temperature: data.temperature || city.temperature,
    daylightHours: data.daylightHours || city.daylightHours,
    raining: data.conditions?.includes('RAIN') || false,
    snowing: data.conditions?.includes('SNOW') || false,
    freezing: data.temperature <= 0
  };
}

/**
 * Fetch expected tourist amount for the given city. If OFFLINE is set,
 * the configured value is used instead.
 */
export async function fetchTourists(city) {
  if (process.env.OFFLINE) {
    return city.expectedTourists;
  }

  if (!process.env.TOURISM_API_KEY) {
    throw new Error('Missing TOURISM_API_KEY');
  }

  const url =
    `https://tourism.example.com/api/visitors?city=${encodeURIComponent(city.name)}` +
    `&key=${process.env.TOURISM_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Tourism API error ${res.status}`);
  }
  const data = await res.json();
  return data.expectedVisitors || city.expectedTourists;
}

export function estimateEnergy(city) {
  const base = city.population * 0.02;
  const touristFactor = city.expectedTourists * 0.015;
  const tempFactor = city.temperature > 22 ? 1.2 : 0.8;
  const daylightFactor = city.daylightHours / 12;
  let weatherFactor = 1;
  if (city.raining || city.snowing || city.freezing) {
    weatherFactor += 0.1;
  }
  return (base + touristFactor) * tempFactor * daylightFactor * weatherFactor;
}

export function loadCities() {
  const data = fs.readFileSync(new URL('./cities.json', import.meta.url));
  return JSON.parse(data);
}

export async function calculateCity(city) {
  const weather = await fetchWeather(city);
  const expectedTourists = await fetchTourists(city);
  const data = {
    ...city,
    ...weather,
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
