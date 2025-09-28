import CreateArticleForm from '@/components/CreateArticle';
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";


export default async function CreatePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  return (
    <div className="max-w-2xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">📝 Create Article</h1>
      <CreateArticleForm />
    </div>
  );
}
