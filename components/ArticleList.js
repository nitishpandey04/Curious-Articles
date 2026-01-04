'use client';

import { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/articles');
        if (!res.ok) {
          throw new Error('Failed to fetch articles');
        }
        const data = await res.json();
        setArticles(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  if (isLoading) {
    return <p className="text-gray-500 text-center">Loading articles...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-gray-500 text-center">No articles found.</p>;
  }

  return (
    <ul className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </ul>
  );
}
