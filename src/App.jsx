import React, { useState } from 'react'
import {
  Search,
  Loader2,
  AlertCircle,
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle
} from 'lucide-react'
import { geocodeCity, getCurrentWeather, getWeatherCondition } from './services/weather'

const iconMap = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  HelpCircle
}

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchName, setActiveSearchName] = useState('')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    const city = searchQuery.trim()
    setActiveSearchName(city)
    setLoading(true)
    setError(null)
    try {
      const loc = await geocodeCity(city)
      if (!loc) {
        setError(`Invalid city name or city not found: "${city}"`)
        setLocation(null)
        setWeather(null)
      } else {
        setLocation(loc)
        const wData = await getCurrentWeather(loc.latitude, loc.longitude)
        setWeather(wData)
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.')
      setLocation(null)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const condition = weather ? getWeatherCondition(weather.weatherCode) : null
  const WeatherIcon = condition ? (iconMap[condition.icon] || HelpCircle) : HelpCircle

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex items-center justify-center p-4 font-sans selection:bg-[#f8b461]/30 selection:text-[#e07d16]">
      <div className="w-full max-w-[480px]">
        <div className="mb-6">
          <p className="text-[11px] uppercase font-bold tracking-widest text-slate-400 mb-1">
            Station Readout
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Current Conditions
          </h1>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search a city..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f8b461] focus:ring-1 focus:ring-[#f8b461]/50 text-sm transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#f8b461] hover:bg-[#e07d16] hover:text-white text-slate-950 font-medium px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
            >
              Go
            </button>
          </form>

          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-8 shadow-xl shadow-slate-200/40 text-center transition-all duration-300">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#e07d16]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">Reading sensors for {activeSearchName}...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-rose-500 bg-rose-50/50 border border-rose-100 rounded-xl gap-2.5">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
                <p className="text-xs text-rose-400">Please check spelling or try another query.</p>
              </div>
            ) : location && weather && condition ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 tracking-tight">{location.name}</h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                    {location.region ? `${location.region}, ` : ''}{location.country}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 my-6">
                  <WeatherIcon className={`w-16 h-16 ${condition.color} stroke-[1.5] drop-shadow-sm`} />
                  <div className="flex flex-col items-start">
                    <div className="flex items-start gap-0.5 text-slate-900">
                      <span className="text-6xl font-semibold tracking-tighter">
                        {parseFloat(weather.temperature).toFixed(1)}
                      </span>
                      <span className="text-xl font-medium text-[#e07d16] mt-1.5">
                        {weather.tempUnit}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#e07d16] mt-1">
                      {condition.description}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Humidity: {weather.humidity}{weather.humidityUnit}
                </p>
              </div>
            ) : (
              <p className="text-slate-400">Search a city to see weather info.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
