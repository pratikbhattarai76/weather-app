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

export function getWeatherCondition(code) {
  const mapping = {
    0: { description: 'Clear Sky', icon: 'Sun', color: 'text-amber-500' },
    1: { description: 'Mainly Clear', icon: 'CloudSun', color: 'text-sky-400' },
    2: { description: 'Partly Cloudy', icon: 'CloudSun', color: 'text-slate-400' },
    3: { description: 'Overcast', icon: 'Cloud', color: 'text-slate-400' },
    45: { description: 'Foggy', icon: 'CloudFog', color: 'text-slate-400' },
    48: { description: 'Foggy', icon: 'CloudFog', color: 'text-slate-400' },
    51: { description: 'Drizzle', icon: 'CloudDrizzle', color: 'text-blue-400' },
    53: { description: 'Drizzle', icon: 'CloudDrizzle', color: 'text-blue-400' },
    55: { description: 'Drizzle', icon: 'CloudDrizzle', color: 'text-blue-400' },
    56: { description: 'Freezing Drizzle', icon: 'CloudDrizzle', color: 'text-teal-400' },
    57: { description: 'Freezing Drizzle', icon: 'CloudDrizzle', color: 'text-teal-400' },
    61: { description: 'Rainy', icon: 'CloudRain', color: 'text-blue-500' },
    63: { description: 'Rainy', icon: 'CloudRain', color: 'text-blue-500' },
    65: { description: 'Heavy Rain', icon: 'CloudRain', color: 'text-blue-600' },
    66: { description: 'Freezing Rain', icon: 'CloudRain', color: 'text-teal-500' },
    67: { description: 'Freezing Rain', icon: 'CloudRain', color: 'text-teal-500' },
    71: { description: 'Snowy', icon: 'CloudSnow', color: 'text-sky-300' },
    73: { description: 'Snowy', icon: 'CloudSnow', color: 'text-sky-300' },
    75: { description: 'Heavy Snow', icon: 'CloudSnow', color: 'text-sky-400' },
    77: { description: 'Snow Grains', icon: 'CloudSnow', color: 'text-sky-200' },
    80: { description: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-500' },
    81: { description: 'Rain Showers', icon: 'CloudRain', color: 'text-blue-500' },
    82: { description: 'Violent Rain Showers', icon: 'CloudRain', color: 'text-blue-700' },
    85: { description: 'Snow Showers', icon: 'CloudSnow', color: 'text-sky-300' },
    86: { description: 'Snow Showers', icon: 'CloudSnow', color: 'text-sky-300' },
    95: { description: 'Thunderstorm', icon: 'CloudLightning', color: 'text-amber-600' },
    96: { description: 'Thunderstorm with Hail', icon: 'CloudLightning', color: 'text-slate-600' },
    99: { description: 'Thunderstorm with Hail', icon: 'CloudLightning', color: 'text-slate-600' }
  }
  return mapping[code] || { description: 'Unknown', icon: 'HelpCircle', color: 'text-slate-400' }
}

export async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('failed to fetch weather data')
  }
  const data = await response.json()
  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    tempUnit: data.current_units.temperature_2m,
    humidityUnit: data.current_units.relative_humidity_2m,
    windSpeedUnit: data.current_units.wind_speed_10m
  }
}
