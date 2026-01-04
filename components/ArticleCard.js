import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';

export default function ArticleCard({ article }) {
  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);
  const author = article.userName || article.userEmail || 'Unknown';

  return (
    <li className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition">
      <Link href={`/article/${article.id}`} className="block">
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          {article.prompt}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          By {author} &bull; {dateStr} &bull; {timeStr}
        </p>
      </Link>
    </li>
  );
}
