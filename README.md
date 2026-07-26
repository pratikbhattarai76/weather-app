# Weather Station App

A simple yet elegant and premium Weather App built with React, Vite, ESLint, and Tailwind CSS (v4).

## Features
- **City Search**: Interactively search for any city in the world.
- **Geocoding API**: Resolves city names to physical coordinates via the Open-Meteo Geocoding API.
- **Forecast API**: Fetches live current weather conditions using the resolved coordinates.
- **Exact Decimals**: Displays temperature readings using exact decimal formatting from the API response without rounding up.
- **Premium Styling**: Structured with Tailwind CSS v4 light theme glassmorphism elements, custom icons, and dynamic status-colored graphics.
- **Micro-animations**: Interactive hover triggers, click scales, active focuses, and spin loading indicators.
- **Mobile Responsive**: Scaled and tested for smooth compatibility across desktop and mobile screens.

## Technical Architecture
- Built with standard React hooks (`useState` and `useEffect` where applicable).
- Data fetches executed asynchronously via modern `async/await` syntax with full network exception fallback handling.
- Free from code comments to preserve clean workspace aesthetics.
- Clean ESLint validation.
