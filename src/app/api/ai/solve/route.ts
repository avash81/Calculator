import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/** // Edge runtime forces Next.js to run this on Vercel Edge where globalThis resets */
export const runtime = 'edge';

// Initialize Redis client gracefully (won't crash if ENVs are missing)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

// Create a new ratelimiter, that allows 10 requests per 1 minute
const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  analytics: true,
}) : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const query = body?.query;
    if (typeof query !== 'string') {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }
    if (trimmedQuery.length > 800) {
      return NextResponse.json({ error: 'Query too long' }, { status: 413 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({ 
        answer: "AI solver is temporarily unavailable. Please try again shortly." 
      });
    }

    // Rate Limiting Logic via Upstash
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
    
    if (ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(`ai_solve_${ip}`);
      if (!success) {
        return NextResponse.json({ error: 'Too many requests' }, { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          }
        });
      }
    } else {
      // In development or if UPSTASH is missing, we use a basic fallback that at least stops rapid looping 
      // within the SAME function instance lifespan, though it will reset often on Vercel Edge.
      const g = globalThis as any;
      g.__aiSolveRateMap = g.__aiSolveRateMap || new Map<string, { count: number; resetAt: number }>();
      const rateMap: Map<string, { count: number; resetAt: number }> = g.__aiSolveRateMap;
      const now = Date.now();
      const bucket = rateMap.get(ip);
      if (!bucket || now > bucket.resetAt) {
        rateMap.set(ip, { count: 1, resetAt: now + 60000 });
      } else if (bucket.count >= 10) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      } else {
        bucket.count++;
      }
    }

    // Call Gemini API via fetch (to avoid extra dependencies)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12_000);
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are CalcPro AI, a friendly and expert math assistant.
User asked: ${trimmedQuery}
Provide a step-by-step explanation in plain text (no LaTeX).
Keep total response under 200 words.`,
                },
              ],
            },
          ],
        }),
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      const errData = await response.json();
      console.error('Gemini API Error:', errData);
      return NextResponse.json({ 
        answer: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." 
      }, { status: 500 });
    }

    const data = await response.json();
    const answerRaw =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      'I couldn\'t find a solution. Please check your expression.';
    const answerText = typeof answerRaw === 'string' ? answerRaw : String(answerRaw);

    // Prevent HTML injection if the client ever decides to render as HTML.
    const answerNoTags = answerText.replace(/<[^>]*>/g, '').trim();
    const limited = answerNoTags.split(/\s+/).slice(0, 220).join(' ');

    return NextResponse.json({ answer: limited });

  } catch (error) {
    console.error('AI Solver Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
