# NRG Application

This repository contains three parts:

1. **service/** – a Node.js service that reads city configurations and calculates hourly energy consumption in megawatts.
2. **backend/** – a minimal HTTP API server that exposes energy consumption data.
3. **frontend/** – an Angular 19 standalone example using Bootstrap to display the data.

All code runs with built-in Node modules so that it works in this restricted environment.

## Service

The service reads `service/cities.json` for city definitions, including optional
`baseConsumption` and `peakConsumption` values (in MW) used when running
offline. When run it retrieves current weather data, tourist estimates and
typical energy consumption ranges for each city before calculating the hourly
energy demand in megawatts. In offline environments set the `OFFLINE`
environment variable to skip API calls and rely on the values present in the
configuration file. When offline the weather is approximated using the current
date and the city's hemisphere.

Required environment variables for real data:

- `WEATHER_API_KEY` – API key for the Google Weather service.
- `NEWS_API_KEY` – API key for NewsAPI used to estimate tourist demand and to
  parse articles for typical energy consumption values.

Run manually:

```bash
cd service && npm start
```

To run the service tests:
```bash
cd service && npm test
```

The backend can be started with `npm start` inside the `backend` folder. The frontend is a static sample that does not require a build step.
