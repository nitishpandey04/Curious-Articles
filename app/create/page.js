import CreateArticleForm from '@/components/CreateArticle';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function CreatePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/auth/signin');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Article</h1>
        <p className="text-gray-600 mt-1">Generate an AI-powered article on any topic</p>
      </div>
      <CreateArticleForm />
    </div>
  );
}
