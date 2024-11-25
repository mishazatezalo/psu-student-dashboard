import { NextResponse } from 'next/server'
import Parser from 'rss-parser'

type CustomFeed = {
  title: string;
  description: string;
  link: string;
}

type CustomItem = {
  title: string;
  link: string;
  contentSnippet?: string;
  pubDate: string;
}

export async function GET() {
  try {
    console.log('Fetching RSS feed...')
    const parser: Parser<CustomFeed, CustomItem> = new Parser({
      customFields: {
        item: ['contentSnippet']
      }
    })
    
    const feed = await parser.parseURL('https://onwardstate.com/feed/')
    console.log('Feed fetched successfully')
    
    const articles = feed.items.slice(0, 5).map(item => ({
      title: item.title || 'No title',
      excerpt: item.contentSnippet?.slice(0, 150) + '...' || 'No excerpt available',
      url: item.link || '#',
      pubDate: item.pubDate || ''
    }))

    console.log('Processed articles:', articles)

    return NextResponse.json(articles)
  } catch (error) {
    console.error('Error in /api/news:', error)
    return NextResponse.json({
      error: 'Failed to fetch news',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

