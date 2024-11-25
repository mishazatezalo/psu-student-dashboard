'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Loader2, Wind, Droplets } from 'lucide-react'

type WeatherData = {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  loading: boolean;
  error: string | null;
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    city: '',
    temperature: 0,
    condition: '',
    humidity: 0,
    windSpeed: 0,
    loading: true,
    error: null
  })

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('/api/weather')
        const data = await response.json()

        if (!response.ok || data.error) {
          throw new Error(data.error || 'Failed to fetch weather data')
        }
        
        setWeather({
          city: data.name,
          temperature: Math.round(data.main.temp),
          condition: data.weather[0].main,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          loading: false,
          error: null
        })
      } catch (error) {
        console.error('Error fetching weather:', error)
        setWeather(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }))
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-20 w-20 text-yellow-400" />
      case 'clouds':
        return <Cloud className="h-20 w-20 text-gray-400" />
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-20 w-20 text-blue-400" />
      default:
        return <Cloud className="h-20 w-20 text-gray-400" />
    }
  }

  if (weather.loading) {
    return (
      <Card className="bg-white/90">
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-10 w-10 animate-spin text-[#001E44]" />
        </CardContent>
      </Card>
    )
  }

  if (weather.error) {
    return (
      <Card className="bg-white/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[#001E44]">Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-lg">Error: {weather.error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#001E44]">
          Weather in State College
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <p className="text-5xl font-bold text-[#001E44]">{weather.temperature}°F</p>
            <p className="text-xl text-[#1E407C] capitalize">{weather.condition}</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        <div className="grid grid-cols-2 gap-4 text-[#1E407C]">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-medium">{weather.humidity}% Humidity</span>
          </div>
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2 text-gray-500" />
            <span className="font-medium">{weather.windSpeed} mph Wind</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



