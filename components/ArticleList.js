// components/ArticleList.js
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Create formatters once at module scope (no Hooks involved)
const dateFmt = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false, // set true for 12-hour format
});

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data || []);
    };
    fetchArticles();
  }, []);

  if (articles.length === 0) {
    return <p className="text-gray-500 text-center">No articles found.</p>;
  }

  return (
    <ul className="space-y-4">
      {articles.map((article) => {
        const created = new Date(article.createdAt);
        const dateStr = dateFmt.format(created);
        const timeStr = timeFmt.format(created);

        return (
          <li
            key={article.id}
            className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
          >
            <Link href={`/article/${article.id}`} className="block">
              <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                {article.prompt}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                By {article.userEmail ?? 'Unknown'} • {dateStr} • {timeStr}
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
