import { NextResponse } from 'next/server'

export async function GET() {
  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  if (!API_KEY) {
    return NextResponse.json({ error: 'API key is not set on the server' }, { status: 500 })
  }

  const city = 'State College,PA,US'
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
    )
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Weather API error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch weather data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


