import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const BLOG_DIR = path.resolve(process.cwd(), 'content/blog');
const BLOG_DIR_PREFIX = `${BLOG_DIR}${path.sep}`;

function sanitizeBlogSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null;
  const s = slug.trim().toLowerCase();
  // Keep it strict to avoid traversal and odd extensions.
  if (!/^[a-z0-9-]{1,80}$/.test(s)) return null;
  return s;
}

// Ensure blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
      .filter(f => f.endsWith('.mdx'))
      .map(file => {
        const content = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8');
        const { data } = matter(content);
        return {
          ...data,
          slug: file.replace('.mdx', ''),
        };
      });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { slug, title, body, ...seoData } = data;

    const safeSlug = sanitizeBlogSlug(slug);
    if (!safeSlug) {
      return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
    }

    if (typeof body !== 'string' || body.length < 1 || body.length > 200000) {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
    }

    const frontmatter = {
      title,
      date: seoData.date || new Date().toISOString(),
      status: seoData.status || 'draft',
      focusKeyword: seoData.focusKeyword,
      metaTitle: seoData.metaTitle,
      metaDescription: seoData.metaDescription,
      excerpt: seoData.metaDescription?.slice(0, 150),
    };

    const content = matter.stringify(body, frontmatter);
    const filePath = path.resolve(BLOG_DIR, `${safeSlug}.mdx`);
    if (!filePath.startsWith(BLOG_DIR_PREFIX)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    fs.writeFileSync(filePath, content);

    return NextResponse.json({ success: true, slug: safeSlug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
