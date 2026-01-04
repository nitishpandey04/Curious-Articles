import ArticleCard from '@/components/ArticleCard';
import { getAllArticles } from '@/lib/db/articles';

export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">Explore</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center">No articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
}
