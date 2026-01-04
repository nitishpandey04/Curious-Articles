import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { getAllArticles, getArticlesByUser } from '@/lib/db/articles';
import { successResponse, errorResponse } from '@/lib/utils/apiResponse';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const articles = session?.user?.email
      ? await getArticlesByUser(session.user.email)
      : await getAllArticles();

    return successResponse(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return errorResponse('Failed to fetch articles');
  }
}
