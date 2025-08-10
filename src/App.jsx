import React, { useState, useEffect } from 'react';
import { Search, MapPin, Thermometer, Droplets, Wind, Eye, Cloud, Sun, CloudRain, CloudSnow } from 'lucide-react';

const WeatherApp = () => {
  // State management for our app
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Get weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('Location not found');
      const data = await response.json();
      setWeather({
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      });
    } catch (err) {
      setError('Could not get weather for your location.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Weather icons mapping with improved colors
  const getWeatherIcon = (condition) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun className="w-20 h-20 text-amber-300 drop-shadow-lg" />;
    } else if (lowerCondition.includes('cloud')) {
      return <Cloud className="w-20 h-20 text-slate-200 drop-shadow-lg" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <CloudRain className="w-20 h-20 text-sky-300 drop-shadow-lg" />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className="w-20 h-20 text-slate-100 drop-shadow-lg" />;
    } else {
      return <Cloud className="w-20 h-20 text-slate-200 drop-shadow-lg" />;
    }
  };

  // Detect location on app load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          setError("Location access denied. Please search manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // Fetch weather from OpenWeatherMap
  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error('City not found or API error');
      }

      const data = await response.json();

      const weatherData = {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        visibility: data.visibility / 1000
      };

      setWeather(weatherData);
    } catch (err) {
      setError('City not found. Please try again with a valid city name.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    fetchWeather();
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  // Demo function for testing
  const loadDemoData = () => {
    setWeather({
      city: 'New York',
      country: 'United States',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      pressure: 1013,
      windSpeed: 15,
      visibility: 10
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-5xl font-bold text-white mb-3 drop-shadow-2xl tracking-tight">
            WeatherNow
          </h1>
          <p className="text-violet-200 drop-shadow-lg text-lg font-medium">
            Real-time weather updates
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <div className="relative group">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="w-full px-6 py-4 pr-16 rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-violet-300 focus:ring-opacity-50 outline-none text-slate-700 placeholder-slate-400 bg-white bg-opacity-95 backdrop-blur-sm transition-all duration-300 group-hover:shadow-xl font-medium"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 text-white p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white bg-opacity-15 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-6 border border-white border-opacity-20">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
              <span className="ml-4 text-white font-semibold text-lg">Loading weather data...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500 bg-opacity-20 backdrop-blur-lg border border-red-300 border-opacity-30 rounded-2xl p-5 mb-6 shadow-xl">
            <p className="text-red-100 text-center font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Weather Data Display */}
        {weather && !loading && (
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20 transform transition-all duration-500 hover:scale-105 hover:bg-opacity-15">
            {/* Location */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-violet-300 mr-3 drop-shadow-lg" />
                <h2 className="text-3xl font-bold text-violet drop-shadow-2xl">
                  {weather.city}
                </h2>
              </div>
              <p className="text-violet-200 font-medium text-lg drop-shadow">
                {weather.country}
              </p>
            </div>

            {/* Main Weather Info */}
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                {getWeatherIcon(weather.condition)}
              </div>
              <div className="text-7xl font-extrabold text-voilet mb-3 drop-shadow-2xl tracking-tight">
                {weather.temperature}°
              </div>
              <div className="text-2xl text-violet drop-shadow-lg font-semibold capitalize opacity-90">
                {weather.condition}
              </div>
            </div>

            {/* Weather Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Humidity */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 bg-opacity-20 rounded-2xl p-5 shadow-lg border border-blue-300 border-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Droplets className="w-6 h-6 text-blue-200 mr-3 drop-shadow" />
                  <span className="text-blue-100 text-sm font-semibold">Humidity</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.humidity}%
                </div>
              </div>

              {/* Wind Speed */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 bg-opacity-20 rounded-2xl p-5 shadow-lg border border-emerald-300 border-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Wind className="w-6 h-6 text-emerald-200 mr-3 drop-shadow" />
                  <span className="text-emerald-100 text-sm font-semibold">Wind Speed</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.windSpeed} km/h
                </div>
              </div>

              {/* Pressure */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 bg-opacity-20 rounded-2xl p-5 shadow-lg border border-amber-300 border-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Thermometer className="w-6 h-6 text-amber-200 mr-3 drop-shadow" />
                  <span className="text-amber-100 text-sm font-semibold">Pressure</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.pressure} mb
                </div>
              </div>

              {/* Visibility */}
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 bg-opacity-20 rounded-2xl p-5 shadow-lg border border-violet-300 border-opacity-20 hover:bg-opacity-30 transition-all duration-300 backdrop-blur-sm">
                <div className="flex items-center mb-3">
                  <Eye className="w-6 h-6 text-violet-200 mr-3 drop-shadow" />
                  <span className="text-violet-100 text-sm font-semibold">Visibility</span>
                </div>
                <div className="text-white text-2xl font-bold drop-shadow-lg">
                  {weather.visibility} km
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-violet-300 text-sm font-medium opacity-80">
            Built with React & Tailwind CSS
          </p>
          <div className="flex justify-center mt-2">
            <div className="w-2 h-2 bg-violet-400 rounded-full mx-1 opacity-60"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full mx-1 opacity-60"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full mx-1 opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;