import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';
import VisibilityBadge from './VisibilityBadge';

export default function ArticleCard({ article, showVisibility = false }) {
  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);
  const author = article.userName || article.userEmail?.split('@')[0] || 'Unknown';

  return (
    <li className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <Link href={`/article/${article.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {article.prompt}
          </h2>
          {showVisibility && (
            <VisibilityBadge isPublic={article.isPublic !== false} />
          )}
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {author}
          </span>
          <span className="text-gray-300">|</span>
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {dateStr}
          </span>
          <span className="text-gray-300">|</span>
          <span>{timeStr}</span>
          {(article.likeCount > 0 || article.commentCount > 0) && (
            <>
              <span className="text-gray-300">|</span>
              <span className="inline-flex items-center gap-2">
                {article.likeCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-red-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {article.likeCount}
                  </span>
                )}
                {article.commentCount > 0 && (
                  <span className="inline-flex items-center gap-1 text-blue-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {article.commentCount}
                  </span>
                )}
              </span>
            </>
          )}
        </div>
      </Link>
    </li>
  );
}
