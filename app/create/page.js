import CreateArticleForm from '@/components/CreateArticle';

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">📝 Create Article</h1>
      <CreateArticleForm />
    </div>
  );
}
