'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    };

    fetchArticles();
  }, []);

  if (articles.length === 0) {
    return <p className="text-gray-500 text-center">No articles found.</p>;
  }

  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <li
          key={article.id}
          className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
        >
          <Link href={`/article/${article.id}`} className="block">
            <h2 className="text-lg font-semibold text-blue-600 hover:underline">
              {article.prompt}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(article.createdAt).toLocaleString()}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
