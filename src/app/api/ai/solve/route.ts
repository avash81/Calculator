import { NextResponse } from 'next/server';

/**
 * @fileoverview API Route for AI Math Solver
 * POST /api/ai/solve
 */

export async function POST(req: Request) {
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

    // Basic in-memory rate limiting (prevents trivial abuse).
    const rateKey =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown';
    const g = globalThis as any;
    g.__aiSolveRateMap = g.__aiSolveRateMap || new Map<string, { count: number; resetAt: number }>();
    const rateMap: Map<string, { count: number; resetAt: number }> = g.__aiSolveRateMap;
    const now = Date.now();
    const windowMs = 60_000; // 1 minute
    const maxRequests = 10; // per minute per IP

    const bucket = rateMap.get(rateKey);
    if (!bucket || now > bucket.resetAt) {
      rateMap.set(rateKey, { count: 1, resetAt: now + windowMs });
    } else if (bucket.count >= maxRequests) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    } else {
      bucket.count++;
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
