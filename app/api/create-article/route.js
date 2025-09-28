// app/api/create-article/route.js
import { Article } from '@/lib/article';

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, breadth, depth } = body;

    const article = new Article(name, breadth, depth);
    await article.generate();
    const markdown = article.toMarkdown();

    const fileName = `${id}.md`;
    return new Response(markdown, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename=${fileName}`,
      },
    });
  } catch (err) {
    console.error('create-article error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
