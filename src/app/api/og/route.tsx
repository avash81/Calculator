import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic params
    const title = searchParams.get('title') || 'CalcPro.NP — Best Free Calculators';
    const description = searchParams.get('description') || 'Free online calculators for Nepal';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a', // slate-900
            padding: '40px 80px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            {/* Simple logo representation */}
            <div style={{
              background: '#2563eb', // blue-600
              color: 'white',
              fontSize: 60,
              fontWeight: 900,
              padding: '10px 40px',
              borderRadius: '20px',
              marginRight: '20px',
              fontFamily: 'sans-serif'
            }}>
              +−×÷
            </div>
            <span style={{ fontSize: 50, color: '#38bdf8', fontWeight: 800, fontFamily: 'sans-serif' }}>
              CalcPro.NP
            </span>
          </div>

          <div
            style={{
              fontSize: 70,
              fontWeight: 900,
              color: 'white',
              textAlign: 'center',
              marginTop: '40px',
              fontFamily: 'sans-serif',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: '#94a3b8', // slate-400
              textAlign: 'center',
              marginTop: '20px',
              fontFamily: 'sans-serif',
            }}
          >
            {description}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 });
  }
}
