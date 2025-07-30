# NRG Application

This repository contains three parts:

1. **service/** – a Node.js service that reads city configurations and calculates hourly energy consumption.
2. **backend/** – a minimal HTTP API server that exposes energy consumption data.
3. **frontend/** – an Angular 19 standalone example using Bootstrap to display the data.

All code runs with built-in Node modules so that it works in this restricted environment.

## Service

The service reads `service/cities.json` for city definitions. When run it
retrieves current weather data and estimated tourists for each city before
calculating the hourly energy consumption. In offline environments set the
`OFFLINE` environment variable to skip API calls and rely on the values present
in the configuration file.

Required environment variables for real data:

- `WEATHER_API_KEY` – API key for the Google Weather service.
- `TOURISM_API_KEY` – API key for the tourism service.

Run manually:

```bash
cd service && npm start
```

To run the service tests:
```bash
cd service && npm test
```

The backend can be started with `npm start` inside the `backend` folder. The frontend is a static sample that does not require a build step.
