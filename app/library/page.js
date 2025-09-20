import ArticleList from '@/components/ArticleList';

export default function LibraryPage() {
  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">📚 Library</h1>
      <ArticleList />
    </div>
  );
}
