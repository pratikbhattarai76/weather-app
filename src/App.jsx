import { useState } from 'react'
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
    fetchWeather(searchQuery.trim())
  }

  const condition = weather ? getWeatherCondition(weather.weatherCode) : null
  const WeatherIcon = condition ? (iconMap[condition.icon] || HelpCircle) : HelpCircle

  return (
    <div className="min-h-screen bg-[#f4f7fa] text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-[#f8b461]/35 selection:text-[#e07d16]">
      <div className="w-full max-w-[440px] mx-auto">
        <div className="mb-6">
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
                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#f8b461]/60 focus:ring-1 focus:ring-[#f8b461]/30 text-sm transition-all shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="bg-[#f8b461] hover:bg-[#e07d16] hover:text-white text-slate-950 hover:scale-[1.03] active:scale-[0.97] font-medium px-5 py-2.5 rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-sm"
            >
              Go
            </button>
          </form>

          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-6 sm:p-8 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-slate-200/50 hover:border-white text-center transition-all duration-500">
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
                  <h2 className="text-2xl font-semibold text-slate-800 tracking-tight transition-all duration-300">{location.name}</h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-1 transition-all duration-300">
                    {location.region ? `${location.region}, ` : ''}{location.country}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-6 my-6 transition-all duration-500 transform hover:scale-[1.03]">
                  <WeatherIcon className={`w-16 h-16 ${condition.color} stroke-[1.5] drop-shadow-sm transition-all duration-300`} />
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

                <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
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
