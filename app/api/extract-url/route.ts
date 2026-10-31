import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { classifySourceCategory, detectDateFreshnessWarning } from '@/lib/analysis-logic';

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 private ranges
  const parts = lower.split('.').map(Number);
  if (parts.length === 4 && parts.every((p) => !isNaN(p))) {
    if (parts[0] === 10) return true;
    if (parts[0] === 127) return true;
    if (parts[0] === 169 && parts[1] === 254) return true;
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
    if (parts[0] === 192 && parts[1] === 168) return true;
  }

  return false;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL is required.' }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format.' }, { status: 400 });
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTP and HTTPS URLs are permitted.' }, { status: 400 });
    }

    if (isPrivateIpOrHost(parsedUrl.hostname)) {
      return NextResponse.json(
        { error: 'Security violation: Access to localhost or private network IP addresses is restricted.' },
        { status: 403 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 DigitalDarkSpot/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Unable to access URL. Server responded with status ${res.status} (${res.statusText}).` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, noscript, nav, footer, header, svg, iframe, form, .cookie-banner, .advertisement').remove();

    // Extract title
    let title = $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text().trim() ||
      parsedUrl.hostname;

    title = title.replace(/\s+/g, ' ').trim();

    // Extract organization / site name
    const org = $('meta[property="og:site_name"]').attr('content') ||
      $('meta[name="publisher"]').attr('content') ||
      parsedUrl.hostname.replace(/^www\./, '');

    // Extract dates
    let pubDate = $('meta[property="article:published_time"]').attr('content') ||
      $('meta[name="publication_date"]').attr('content') ||
      $('meta[name="date"]').attr('content') ||
      $('time').attr('datetime');

    if (pubDate && pubDate.includes('T')) {
      pubDate = pubDate.split('T')[0];
    }

    const updatedDate = $('meta[property="article:modified_time"]').attr('content')?.split('T')[0];

    // Extract article text
    let mainText = '';
    const articleContainer = $('article, main, [role="main"], .content, #content, .post-content, .entry-content');
    if (articleContainer.length > 0) {
      mainText = articleContainer.first().text();
    } else {
      mainText = $('body').text();
    }

    // Clean whitespace
    mainText = mainText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join('\n');

    if (mainText.length > 15000) {
      mainText = mainText.slice(0, 15000) + '\n[Content truncated for analysis]';
    }

    if (mainText.length < 50) {
      return NextResponse.json(
        { error: 'Extracted text is too short or page content is protected by client-side JavaScript rendering.' },
        { status: 422 }
      );
    }

    const category = classifySourceCategory(parsedUrl.hostname, org);
    const freshness = detectDateFreshnessWarning(pubDate || updatedDate);

    return NextResponse.json({
      success: true,
      data: {
        title: title.slice(0, 200),
        url: parsedUrl.toString(),
        domain: parsedUrl.hostname,
        organization: org,
        publicationDate: pubDate || undefined,
        updatedDate: updatedDate || undefined,
        extractedText: mainText,
        category,
        freshnessWarning: freshness,
        extractionConfidence: 92,
      },
    });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out after 12 seconds.' }, { status: 504 });
    }
    return NextResponse.json({ error: error.message || 'Failed to extract content from URL.' }, { status: 500 });
  }
}
