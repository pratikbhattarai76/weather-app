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
      return 'bg-amber-100/75 text-amber-700 border-amber-200/50'
    } else if (colorClass.includes('sky')) {
      return 'bg-sky-100/75 text-sky-700 border-sky-200/50'
    } else if (colorClass.includes('blue')) {
      return 'bg-blue-100/75 text-blue-700 border-blue-200/50'
    } else if (colorClass.includes('teal')) {
      return 'bg-teal-100/75 text-teal-700 border-teal-200/50'
    } else if (colorClass.includes('slate')) {
      return 'bg-slate-100/75 text-slate-700 border-slate-200/50'
    }
    return 'bg-slate-100/75 text-slate-600 border-slate-200/50'
  }

  const getBlobGradient = () => {
    if (!weather) return 'from-violet-400/25 via-pink-400/20 to-indigo-400/25'
    switch (weather.weatherCode) {
      case 0:
        return 'from-amber-400/35 via-orange-400/25 to-yellow-300/30'
      case 1:
      case 2:
      case 3:
        return 'from-slate-400/30 via-blue-400/20 to-slate-300/25'
      case 45:
      case 48:
        return 'from-zinc-400/30 via-slate-400/20 to-stone-400/25'
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return 'from-blue-500/35 via-indigo-500/25 to-cyan-400/30'
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return 'from-sky-300/40 via-blue-200/30 to-sky-100/30'
      case 95:
      case 96:
      case 99:
        return 'from-purple-800/30 via-amber-600/20 to-indigo-900/35'
      default:
        return 'from-violet-400/25 via-pink-400/20 to-indigo-400/25'
    }
  }

  const getCardBackground = () => {
    if (!weather) return 'bg-white border-white/60'
    switch (weather.weatherCode) {
      case 0:
        return 'bg-gradient-to-b from-amber-50/90 to-white/95 border-amber-100/50'
      case 1:
      case 2:
      case 3:
        return 'bg-gradient-to-b from-slate-50/90 to-white/95 border-slate-200/50'
      case 45:
      case 48:
        return 'bg-gradient-to-b from-zinc-50/90 to-white/95 border-zinc-200/50'
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:
      case 61:
      case 63:
      case 65:
      case 66:
      case 67:
      case 80:
      case 81:
      case 82:
        return 'bg-gradient-to-b from-blue-50/90 to-white/95 border-blue-100/50'
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return 'bg-gradient-to-b from-sky-50/90 to-white/95 border-sky-100/50'
      case 95:
      case 96:
      case 99:
        return 'bg-gradient-to-b from-purple-50/90 to-white/95 border-purple-100/50'
      default:
        return 'bg-white border-white/60'
    }
  }

  return (
    <div className="relative min-h-screen bg-[#e9edf2] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#f8b461]/35 selection:text-[#e07d16] overflow-hidden">
      <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr ${getBlobGradient()} blur-[100px] transition-all duration-1000 animate-pulse`}></div>
      <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br ${getBlobGradient()} blur-[100px] transition-all duration-1000 animate-pulse`}></div>

      <div className="relative w-full max-w-[440px] mx-auto z-10">
        <div className="bg-white/40 border border-slate-200/50 backdrop-blur-xl rounded-[32px] p-5 sm:p-6 shadow-xl shadow-slate-300/10 space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 drop-shadow-sm px-1">
              Weather
            </h1>
          </div>

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

          <div className={`backdrop-blur-md rounded-[24px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-white transition-all duration-750 border ${getCardBackground()}`}>
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

                  <div className="flex items-center justify-center bg-white/90 border border-slate-100 rounded-2xl w-24 h-24 sm:w-28 sm:h-28 shadow-sm shrink-0 self-center">
                    <WeatherIcon className={`w-12 h-12 sm:w-14 sm:h-14 ${condition.color} stroke-[1.5] drop-shadow-sm`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                  <div className="bg-white/80 border border-slate-100/60 rounded-xl p-3.5 flex items-center gap-3 text-left hover:bg-white hover:border-slate-200/80 transition-all duration-300 group shadow-sm">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                      <Droplet className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Humidity</p>
                      <p className="text-sm font-semibold text-slate-700">{weather.humidity}{weather.humidityUnit}</p>
                    </div>
                  </div>

                  <div className="bg-white/80 border border-slate-100/60 rounded-xl p-3.5 flex items-center gap-3 text-left hover:bg-white hover:border-slate-200/80 transition-all duration-300 group shadow-sm">
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
