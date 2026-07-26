export async function geocodeCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('failed to geocode city')
  }
  const data = await response.json()
  if (!data.results || data.results.length === 0) {
    return null
  }
  const result = data.results[0]
  return {
    name: result.name,
    latitude: result.latitude,
    longitude: result.longitude,
    region: result.admin1 || '',
    country: result.country || '',
    timezone: result.timezone
  }
}
