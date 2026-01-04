import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { getArticleById } from '@/lib/db/articles';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';

export default async function ArticlePage({ params }) {
  const { articleid } = await params;

  const article = await getArticleById(articleid);
  if (!article) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h1>
        <p className="text-gray-500 mb-6">The article you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/explore"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Browse articles
        </Link>
      </div>
    );
  }

  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);
  const author = article.userName || article.userEmail?.split('@')[0] || 'Unknown';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Back link */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Explore
      </Link>

      {/* Article metadata */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {author}
          </span>
          <span className="text-gray-300">|</span>
          <span>{dateStr}</span>
          <span className="text-gray-300">|</span>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Article content */}
      <article className="prose prose-gray prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900">
        <MDXRemote
          source={article.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>
    </div>
  );
}
