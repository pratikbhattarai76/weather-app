import React, { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { geocodeCity, getCurrentWeather } from './services/weather'

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)
    try {
      const loc = await geocodeCity(searchQuery)
      if (!loc) {
        setError('Invalid city name or city not found.')
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

          <div className="p-4 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-sm bg-white shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-[#e07d16]">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium text-slate-500 animate-pulse">Reading station sensors...</p>
              </div>
            ) : error ? (
              <p className="text-red-500 font-medium">{error}</p>
            ) : location && weather ? (
              <div>
                <p className="font-semibold text-slate-900 text-base">{location.name}</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-0.5">
                  {location.region ? `${location.region}, ` : ''}{location.country}
                </p>
                <div className="mt-3 text-2xl font-bold text-slate-900">
                  {weather.temperature}{weather.tempUnit}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Humidity: {weather.humidity}{weather.humidityUnit}
                </p>
              </div>
            ) : (
              <p>Search a city to see weather info.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
