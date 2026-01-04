import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { getArticleById } from '@/lib/db/articles';
import { formatDate, formatTime } from '@/lib/utils/dateFormatter';

export default async function ArticlePage({ params }) {
  const { articleid } = await params;

  const article = await getArticleById(articleid);
  if (!article) {
    return <div className="text-center mt-10 text-gray-600">Article not found.</div>;
  }

  const dateStr = formatDate(article.createdAt);
  const timeStr = formatTime(article.createdAt);

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-6">
        By {article.userEmail} &bull; {dateStr} &bull; {timeStr}
      </p>
      <article className="prose prose-gray prose-base">
        <MDXRemote
          source={article.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>
    </div>
  );
}
