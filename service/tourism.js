export async function estimateTourists(city) {
  if (process.env.OFFLINE) {
    return city.expectedTourists;
  }

  if (!process.env.NEWS_API_KEY) {
    throw new Error('Missing NEWS_API_KEY');
  }

  const url =
    `https://newsapi.org/v2/everything?q=${encodeURIComponent(city.name)}&apiKey=${process.env.NEWS_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`News API error ${res.status}`);
  }
  const data = await res.json();
  const articles = data.totalResults || 0;
  return (city.expectedTourists || 0) + articles;
}
