import { useState, useEffect } from 'react'
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
  HelpCircle,
  Droplet,
  Wind
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
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchWeather = async (city) => {
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
    } catch {
      setError('Failed to fetch weather data. Please try again.')
      setLocation(null)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    setSuggestions([])
    setShowSuggestions(false)
    fetchWeather(searchQuery.trim())
  }

  const handleSelectSuggestion = async (item) => {
    const displayName = `${item.name}, ${item.country}`
    setSearchQuery(displayName)
    setSuggestions([])
    setShowSuggestions(false)
    setLoading(true)
    setError(null)
    try {
      setLocation({
        name: item.name,
        latitude: item.latitude,
        longitude: item.longitude,
        region: item.admin1 || '',
        country: item.country || ''
      })
      const wData = await getCurrentWeather(item.latitude, item.longitude)
      setWeather(wData)
    } catch {
      setError('Failed to fetch weather data. Please try again.')
      setLocation(null)
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value
    setSearchQuery(val)
    if (val.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
    } else {
      setShowSuggestions(true)
    }
  }

  useEffect(() => {
    if (!showSuggestions || searchQuery.trim().length < 2) return

    const timer = setTimeout(async () => {
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery.trim())}&count=5&language=en&format=json`
        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          if (data.results) {
            setSuggestions(data.results)
          } else {
            setSuggestions([])
          }
        }
      } catch {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, showSuggestions])

  const condition = weather ? getWeatherCondition(weather.weatherCode) : null
  const WeatherIcon = condition ? (iconMap[condition.icon] || HelpCircle) : HelpCircle

  const getPillColors = (colorClass) => {
    if (colorClass.includes('amber')) {
      return 'bg-amber-50 text-amber-600 border-amber-100/60'
    } else if (colorClass.includes('sky')) {
      return 'bg-sky-50 text-sky-600 border-sky-100/60'
    } else if (colorClass.includes('blue')) {
      return 'bg-blue-50 text-blue-600 border-blue-100/60'
    } else if (colorClass.includes('teal')) {
      return 'bg-teal-50 text-teal-600 border-teal-100/60'
    } else if (colorClass.includes('slate')) {
      return 'bg-slate-50 text-slate-600 border-slate-100/60'
    }
    return 'bg-slate-50 text-slate-500 border-slate-100/60'
  }

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#f8b461]/35 selection:text-[#e07d16]">
      <div className="w-full max-w-[440px] mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Current Conditions
          </h1>
        </div>

        <div className="space-y-6">
          <form onSubmit={handleSearch} className="flex items-center gap-2 relative">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder="Search a city..."
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f8b461]/60 focus:ring-1 focus:ring-[#f8b461]/30 text-sm transition-all shadow-sm"
              />

              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden text-left divide-y divide-slate-100/50">
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="w-full px-4 py-2.5 hover:bg-[#f8b461]/10 flex flex-col text-left transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-medium text-slate-800">{item.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                        {item.admin1 ? `${item.admin1}, ` : ''}{item.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#f8b461] hover:bg-[#e07d16] hover:text-white text-slate-950 hover:scale-[1.03] active:scale-[0.97] font-medium px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm"
            >
              Go
            </button>
          </form>

          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[28px] p-6 sm:p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-white transition-all duration-500">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#e07d16]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">Reading data of {activeSearchName}...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-rose-500 bg-rose-50/50 border border-rose-100 rounded-xl gap-2.5">
                <AlertCircle className="w-8 h-8 text-rose-400" />
                <p className="text-sm font-medium text-rose-800">{error}</p>
                <p className="text-xs text-rose-400">Please check spelling or try another query.</p>
              </div>
            ) : location && weather && condition ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between text-left gap-4">
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-tight">{location.name}</h2>
                      <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 mt-1">
                        {location.region ? `${location.region}, ` : ''}{location.country}
                      </p>
                    </div>

                    <div className="flex items-start gap-0.5 text-slate-900 mt-4">
                      <span className="text-5xl sm:text-6xl font-light tracking-tighter leading-none">
                        {parseFloat(weather.temperature).toFixed(1)}
                      </span>
                      <span className="text-lg font-semibold text-[#e07d16] mt-0.5">
                        {weather.tempUnit}
                      </span>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-3.5 border ${getPillColors(condition.color)}`}>
                        {condition.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center bg-slate-50/50 border border-slate-100 rounded-2xl w-24 h-24 sm:w-28 sm:h-28 shadow-inner shrink-0 self-center">
                    <WeatherIcon className={`w-12 h-12 sm:w-14 sm:h-14 ${condition.color} stroke-[1.5] drop-shadow-sm`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  <div className="bg-slate-50/50 border border-slate-100/80 rounded-xl p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 hover:border-slate-200/80 transition-all duration-300 group">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                      <Droplet className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Humidity</p>
                      <p className="text-sm font-semibold text-slate-700">{weather.humidity}{weather.humidityUnit}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 border border-slate-100/80 rounded-xl p-3.5 flex items-center gap-3 text-left hover:bg-slate-50 hover:border-slate-200/80 transition-all duration-300 group">
                    <div className="p-2 bg-teal-50 rounded-lg text-teal-500 group-hover:scale-110 transition-transform">
                      <Wind className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Wind Speed</p>
                      <p className="text-sm font-semibold text-slate-700">{weather.windSpeed}{weather.windSpeedUnit}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 py-6">Search a city to see weather info.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
