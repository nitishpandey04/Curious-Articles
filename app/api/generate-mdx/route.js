import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { createArticle } from '@/lib/db/articles';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/apiResponse';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const CREATE_ARTICLE_URL = `${BASE_URL}/api/create-article`;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse();
    }

    const body = await req.json();

    const createRes = await fetch(CREATE_ARTICLE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!createRes.ok) {
      return errorResponse('Failed to create article');
    }

    const arrayBuffer = await createRes.arrayBuffer();
    const markdownContent = Buffer.from(arrayBuffer).toString('utf-8');

    const result = await createArticle({
      id: body.id,
      prompt: body.name,
      depth: body.depth,
      breadth: body.breadth,
      content: markdownContent,
      userEmail: session.user.email,
    });

    return successResponse({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('API error:', err);
    return errorResponse('Internal server error');
  }
}
