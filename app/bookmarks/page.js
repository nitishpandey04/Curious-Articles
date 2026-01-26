import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { getUserBookmarks } from '@/lib/db/bookmarks';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';

export const dynamic = 'force-dynamic';

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-500 mb-4">Sign in to view your bookmarked articles.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const bookmarks = await getUserBookmarks(email);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          Bookmarks
        </h1>
        <p className="text-gray-600 mt-1">Articles you&apos;ve saved for later</p>
      </div>

      {bookmarks.length > 0 ? (
        <ul className="space-y-4">
          {bookmarks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h2>
          <p className="text-gray-500 mb-4">Start bookmarking articles to save them for later.</p>
          <Link
            href="/explore"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Explore Articles
          </Link>
        </div>
      )}
    </div>
  );
}
