import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserBookmarks } from '@/lib/db/bookmarks';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return unauthorizedResponse('Please sign in to view bookmarks');
    }

    const bookmarks = await getUserBookmarks(session.user.email);

    return successResponse({ bookmarks });
  } catch (err) {
    console.error('Get bookmarks error:', err);
    return errorResponse('Server error');
  }
}
