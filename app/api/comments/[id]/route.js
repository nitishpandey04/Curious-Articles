import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { deleteComment } from '@/lib/db/comments';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/apiResponse';

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse('Please sign in to delete comments');
    }

    const { id } = await params;

    const result = await deleteComment(id, session.user.email);

    if (!result.success) {
      if (result.error === 'Unauthorized') {
        return unauthorizedResponse('You can only delete your own comments');
      }
      return errorResponse(result.error, 404);
    }

    return successResponse({ success: true });
  } catch (err) {
    console.error('Delete comment error:', err);
    return errorResponse('Server error');
  }
}
