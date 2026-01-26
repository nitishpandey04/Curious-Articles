import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getUserByUsername } from '@/lib/db/users';
import { getPublicArticlesByUsername } from '@/lib/db/articles';
import ProfileHeader from '@/components/ProfileHeader';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }) {
  const { username } = await params;
  const session = await getServerSession(authOptions);

  const user = await getUserByUsername(username);

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">User not found</h1>
        <p className="text-gray-500 mb-6">The user you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/explore"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse articles
        </Link>
      </div>
    );
  }

  const articles = await getPublicArticlesByUsername(username);
  const isOwnProfile = session?.user?.username === username;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Articles ({articles.length})
        </h2>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500">No public articles yet</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
