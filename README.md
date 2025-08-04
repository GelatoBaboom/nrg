# NRG Application

This project estimates hourly energy demand for a set of cities and exposes the
results through a small web interface. A single Node.js server calculates the
values and serves both the API and the frontend.

## Running

```bash
npm start
```

The command computes the energy usage and starts an HTTP server on port 3000.
Open [http://localhost:3000](http://localhost:3000) in a browser to view the
results or request `http://localhost:3000/results` for the raw JSON.

## Tests

```bash
npm test
```

## Service

The calculation logic lives under `service/`. The module reads
`service/cities.json` for city definitions, including optional `baseConsumption`
and `peakConsumption` values (in MW) used when running offline. When run it
retrieves current weather data, tourist estimates and typical energy consumption
ranges for each city before calculating the hourly demand in megawatts.

In offline environments the server sets the `OFFLINE` environment variable to
skip API calls and rely on the values present in the configuration file. When
offline the weather is approximated using the current date and the city's
hemisphere.

Required environment variables for real data:

- `WEATHER_API_KEY` – API key for the Google Weather service.
- `NEWS_API_KEY` – API key for NewsAPI used to estimate tourist demand and to
  parse articles for typical energy consumption values.
