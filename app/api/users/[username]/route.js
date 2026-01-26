import { getUserByUsername } from '@/lib/db/users';
import { getPublicArticlesByUsername } from '@/lib/db/articles';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET(req, { params }) {
  try {
    const { username } = await params;

    const user = await getUserByUsername(username);
    if (!user) {
      return errorResponse('User not found', 404);
    }

    const articles = await getPublicArticlesByUsername(username);

    return successResponse({
      user,
      articles,
    });
  } catch (err) {
    console.error('Get public profile error:', err);
    return errorResponse('Server error');
  }
}
