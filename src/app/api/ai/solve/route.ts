import { NextResponse } from 'next/server';

/**
 * @fileoverview API Route for AI Math Solver
 * POST /api/ai/solve
 */

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({ 
        answer: "AI solving is currently in maintenance mode (API key not configured)." 
      });
    }

    // Call Gemini API via fetch (to avoid extra dependencies)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are CalcPro AI, a friendly and expert math assistant. 
              The user has asked: "${query}". 
              Please provide a step-by-step explanation. 
              - Use plain text (no LaTeX unless standard).
              - Be concise but helpful.
              - Focus on explaining the logic/steps.
              - If it's a simple calculation, confirm the result.
              - Keep the total response under 200 words.`
            }]
          }]
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error('Gemini API Error:', errData);
      return NextResponse.json({ 
        answer: "Sorry, I'm having trouble connecting to my brain right now. Please try again later." 
      }, { status: 500 });
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find a solution. Please check your expression.";

    return NextResponse.json({ answer });

  } catch (error) {
    console.error('AI Solver Route Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
