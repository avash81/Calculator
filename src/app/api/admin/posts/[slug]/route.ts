import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const filePath = path.join(BLOG_DIR, `${params.slug}.mdx`);
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
    const filePath = path.join(BLOG_DIR, `${params.slug}.mdx`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
