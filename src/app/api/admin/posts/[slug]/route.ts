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
  if (!/^[a-z0-9-]{1,80}$/.test(s)) return null;
  return s;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const safeSlug = sanitizeBlogSlug(params.slug);
    if (!safeSlug) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });

    const filePath = path.resolve(BLOG_DIR, `${safeSlug}.mdx`);
    if (!filePath.startsWith(BLOG_DIR_PREFIX)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: body } = matter(content);

    return NextResponse.json({
      ...data,
      body,
      slug: params.slug,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const safeSlug = sanitizeBlogSlug(params.slug);
    if (!safeSlug) return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });

    const filePath = path.resolve(BLOG_DIR, `${safeSlug}.mdx`);
    if (!filePath.startsWith(BLOG_DIR_PREFIX)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
