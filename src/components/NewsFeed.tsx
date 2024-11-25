'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCcw, AlertCircle, ExternalLink, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"

type NewsItem = {
  title: string
  excerpt: string
  url: string
  pubDate: string
}

const FALLBACK_NEWS: NewsItem[] = [
  {
    title: "Unable to fetch latest news",
    excerpt: "We're having trouble connecting to Onward State. Please check back later for updates.",
    url: "https://onwardstate.com",
    pubDate: new Date().toUTCString()
  }
]

export default function NewsFeed() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching news...')
      const response = await fetch('/api/news', {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache'
        }
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Received data:', data)
      
      if (Array.isArray(data) && data.length > 0) {
        setNews(data)
      } else if (data.error) {
        throw new Error(data.error)
      } else {
        throw new Error('Invalid response format or empty news array')
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      setNews(FALLBACK_NEWS)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-white/90">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-[#001E44]">Onward State News</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={fetchNews}
          disabled={loading}
          className="text-[#001E44] hover:bg-[#1E407C]/10"
        >
          <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-[#001E44]" />
          </div>
        ) : error ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-red-500">
              <AlertCircle className="h-6 w-6" />
              <p className="text-lg font-semibold">Error: {error}</p>
            </div>
            <Button 
              onClick={fetchNews}
              className="bg-[#001E44] hover:bg-[#1E407C] text-white"
            >
              Try Again
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {news.map((item, index) => (
              <li key={index} className="border-b border-gray-200 pb-2 last:border-b-0">
                <a 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:bg-[#001E44]/5 p-3 rounded-md transition-colors"
                >
                  <h3 className="text-lg font-bold text-[#001E44] mb-1 flex items-center">
                    {item.title}
                    <ExternalLink className="h-4 w-4 ml-2 inline-block" />
                  </h3>
                  <p className="text-sm text-[#1E407C] mb-1">{item.excerpt}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(item.pubDate).toLocaleString()}
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

