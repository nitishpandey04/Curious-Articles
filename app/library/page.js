import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import ArticleCard from '@/components/ArticleCard';
import { getArticlesByUser } from '@/lib/db/articles';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="max-w-3xl mx-auto mt-12 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Library</h1>
        <p className="text-gray-500 text-center">Sign in to view saved articles.</p>
      </div>
    );
  }

  const articles = await getArticlesByUser(email);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Library</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center">No articles found.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
}
