import { Article } from '@/lib/article';
import { errorResponse, badRequestResponse } from '@/lib/utils/apiResponse';

const MAX_DEPTH = 5;
const MAX_BREADTH = 5;

export async function POST(req) {
  try {
    const body = await req.json();
    const { id, name, breadth, depth } = body;

    if (!id || !name) {
      return badRequestResponse('Missing required fields: id, name');
    }

    const depthNum = parseInt(depth, 10);
    const breadthNum = parseInt(breadth, 10);

    if (isNaN(depthNum) || depthNum < 1 || depthNum > MAX_DEPTH) {
      return badRequestResponse(`Depth must be between 1 and ${MAX_DEPTH}`);
    }

    if (isNaN(breadthNum) || breadthNum < 1 || breadthNum > MAX_BREADTH) {
      return badRequestResponse(`Breadth must be between 1 and ${MAX_BREADTH}`);
    }

    const article = new Article(name, breadthNum, depthNum);
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
    return errorResponse('Internal server error');
  }
}
