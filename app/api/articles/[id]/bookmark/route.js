import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { toggleBookmark } from '@/lib/db/bookmarks';
import { getArticleById } from '@/lib/db/articles';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/apiResponse';

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse('Please sign in to bookmark articles');
    }

    const { id } = await params;

    // Verify article exists
    const article = await getArticleById(id);
    if (!article) {
      return errorResponse('Article not found', 404);
    }

    // Toggle the bookmark
    const result = await toggleBookmark(id, session.user.email);

    return successResponse(result);
  } catch (err) {
    console.error('Toggle bookmark error:', err);
    return errorResponse('Server error');
  }
}
