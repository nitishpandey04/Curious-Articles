import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';

export default function ArticleCard({ article }) {
  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);
  const author = article.userName || article.userEmail?.split('@')[0] || 'Unknown';

  return (
    <li className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <Link href={`/article/${article.id}`} className="block">
        <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {article.prompt}
        </h2>
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
        </div>
      </Link>
    </li>
  );
}
