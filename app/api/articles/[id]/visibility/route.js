import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { updateArticleVisibility, getArticleById } from '@/lib/db/articles';
import { successResponse, errorResponse, unauthorizedResponse, badRequestResponse } from '@/lib/utils/apiResponse';

export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const { isPublic } = await req.json();

    if (typeof isPublic !== 'boolean') {
      return badRequestResponse('isPublic must be a boolean');
    }

    // Verify the article exists and belongs to the user
    const article = await getArticleById(id);
    if (!article) {
      return errorResponse('Article not found', 404);
    }

    if (article.userEmail !== session.user.email) {
      return unauthorizedResponse('You can only modify your own articles');
    }

    const result = await updateArticleVisibility(id, session.user.email, isPublic);

    if (result.matchedCount === 0) {
      return errorResponse('Article not found or unauthorized', 404);
    }

    return successResponse({ success: true, isPublic });
  } catch (err) {
    console.error('Toggle visibility error:', err);
    return errorResponse('Server error');
  }
}
