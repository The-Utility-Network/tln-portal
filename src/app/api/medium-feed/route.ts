import { NextRequest, NextResponse } from 'next/server';

const MEDIUM_RSS_URL = 'https://medium.com/feed/@lochnesssociety';

export async function GET(request: NextRequest) {
  try {
    // Fetch the RSS feed from Medium
    const response = await fetch(MEDIUM_RSS_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse XML using regex (server-side compatible)
    interface Article {
      title: string;
      link: string;
      description: string;
      pubDate: string;
    }
    
    const articles: Article[] = [];
    
    // Extract items using regex
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      // Extract title (handles CDATA)
      const titleMatch = itemContent.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : '';
      
      // Extract link
      const linkMatch = itemContent.match(/<link[^>]*>(.*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1].trim() : '';
      
      // Extract content:encoded (full article content)
      const contentMatch = itemContent.match(/<content:encoded[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content:encoded>/i);
      const description = contentMatch ? contentMatch[1].trim() : '';
      
      // Extract pubDate
      const pubDateMatch = itemContent.match(/<pubDate[^>]*>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? pubDateMatch[1].trim() : '';
      
      if (title && link && description) {
        articles.push({
          title,
          link,
          description,
          pubDate,
        });
      }
    }

    return NextResponse.json({
      status: 'ok',
      items: articles,
      feed: {
        title: 'The Loch Ness Botanical Society',
        description: 'Latest articles from The Loch Ness Botanical Society on Medium',
        link: 'https://medium.com/@lochnesssociety'
      }
    });

  } catch (error) {
    console.error('Error fetching Medium RSS:', error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch Medium feed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 