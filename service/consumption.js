export async function estimateConsumption(city) {
  if (process.env.OFFLINE) {
    return {
      baseConsumption: city.baseConsumption || 0,
      peakConsumption: city.peakConsumption || city.baseConsumption || 0
    };
  }
  if (!process.env.NEWS_API_KEY) {
    throw new Error('Missing NEWS_API_KEY');
  }
  const query = `${city.name} consumo energético megavatios`;
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`News API error ${res.status}`);
  }
  const data = await res.json();
  const numbers = [];
  for (const article of data.articles || []) {
    const text = `${article.title} ${article.description}`;
    const matches = text?.match(/\d+(?:\.\d+)?/g);
    if (matches) {
      for (const m of matches) {
        const n = parseFloat(m);
        if (!Number.isNaN(n)) {
          numbers.push(n);
        }
      }
    }
  }
  if (numbers.length === 0) {
    return {
      baseConsumption: city.baseConsumption || 0,
      peakConsumption: city.peakConsumption || city.baseConsumption || 0
    };
  }
  const peak = Math.max(...numbers);
  const base = Math.min(...numbers);
  return {
    baseConsumption: base,
    peakConsumption: peak
  };
}
