'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';
import VisibilityBadge from './VisibilityBadge';
import VisibilityToggle from './VisibilityToggle';

function LibraryArticleCard({ article, onVisibilityChange }) {
  const [isPublic, setIsPublic] = useState(article.isPublic !== false);
  const [isUpdating, setIsUpdating] = useState(false);

  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);
  const author = article.userName || article.userEmail?.split('@')[0] || 'Unknown';

  const handleToggle = async (newValue) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/articles/${article.id}/visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: newValue }),
      });

      if (res.ok) {
        setIsPublic(newValue);
        if (onVisibilityChange) {
          onVisibilityChange(article.id, newValue);
        }
      }
    } catch (err) {
      console.error('Failed to update visibility:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <li className="group p-5 bg-white border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/article/${article.id}`} className="flex-1 min-w-0">
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

        <div className="flex items-center gap-3 flex-shrink-0">
          <VisibilityBadge isPublic={isPublic} />
          <VisibilityToggle
            isPublic={isPublic}
            onChange={handleToggle}
            disabled={isUpdating}
          />
        </div>
      </div>
    </li>
  );
}

export default function LibraryContent({ initialArticles }) {
  const [articles, setArticles] = useState(initialArticles);

  const handleVisibilityChange = (articleId, newValue) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === articleId ? { ...article, isPublic: newValue } : article
      )
    );
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <p className="text-gray-500 mb-4">You haven&apos;t created any articles yet.</p>
        <Link
          href="/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Create your first article
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <LibraryArticleCard
          key={article.id}
          article={article}
          onVisibilityChange={handleVisibilityChange}
        />
      ))}
    </ul>
  );
}
