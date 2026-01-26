import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getCommentsByArticle, createComment } from '@/lib/db/comments';
import { getArticleById } from '@/lib/db/articles';
import { successResponse, errorResponse, unauthorizedResponse, badRequestResponse } from '@/lib/utils/apiResponse';

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Verify article exists
    const article = await getArticleById(id);
    if (!article) {
      return errorResponse('Article not found', 404);
    }

    const comments = await getCommentsByArticle(id);

    // Remove _id from each comment
    const sanitizedComments = comments.map(({ _id, ...comment }) => comment);

    return successResponse({ comments: sanitizedComments });
  } catch (err) {
    console.error('Get comments error:', err);
    return errorResponse('Server error');
  }
}

export async function POST(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse('Please sign in to comment');
    }

    const { id } = await params;
    const { content } = await req.json();

    // Validate content
    if (!content || typeof content !== 'string') {
      return badRequestResponse('Comment content is required');
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      return badRequestResponse('Comment cannot be empty');
    }

    if (trimmedContent.length > 1000) {
      return badRequestResponse('Comment cannot exceed 1000 characters');
    }

    // Verify article exists
    const article = await getArticleById(id);
    if (!article) {
      return errorResponse('Article not found', 404);
    }

    // Create the comment
    const userName = session.user.username || session.user.name || session.user.email.split('@')[0];
    const comment = await createComment(id, session.user.email, userName, trimmedContent);

    return successResponse({ comment }, 201);
  } catch (err) {
    console.error('Create comment error:', err);
    return errorResponse('Server error');
  }
}
