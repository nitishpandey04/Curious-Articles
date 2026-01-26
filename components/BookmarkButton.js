'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function BookmarkButton({ articleId, initialBookmarked = false }) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!session) {
      return;
    }

    if (isLoading) return;

    // Optimistic update
    const wasBookmarked = bookmarked;
    setBookmarked(!bookmarked);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/articles/${articleId}/bookmark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        setBookmarked(wasBookmarked);
        return;
      }

      const data = await res.json();
      setBookmarked(data.bookmarked);
    } catch {
      setBookmarked(wasBookmarked);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
        bookmarked
          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      } ${!session ? 'cursor-not-allowed opacity-60' : ''} ${isLoading ? 'opacity-50' : ''}`}
      title={!session ? 'Sign in to bookmark' : bookmarked ? 'Remove bookmark' : 'Bookmark'}
    >
      <svg
        className={`w-5 h-5 transition-transform ${bookmarked ? 'scale-110' : ''}`}
        fill={bookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={bookmarked ? 0 : 1.5}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
      <span className="text-sm font-medium">{bookmarked ? 'Saved' : 'Save'}</span>
    </button>
  );
}
