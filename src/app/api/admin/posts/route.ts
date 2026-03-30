import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

// Ensure blog directory exists
if (!fs.existsSync(BLOG_DIR)) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
}

export async function GET() {
  try {
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
    const data = await req.json();
    const { slug, title, body, ...seoData } = data;

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
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);

    fs.writeFileSync(filePath, content);

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to save post' }, { status: 500 });
  }
}
