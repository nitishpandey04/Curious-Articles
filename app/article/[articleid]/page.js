import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'curious-articles';

async function getArticleById(id) {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const article = await db.collection('articles').findOne({ id });
  await client.close();
  return article;
}

export default async function ArticlePage({ params }) {
  // params is provided synchronously to server components in the App Router
  const { articleid } = params;

  const article = await getArticleById(articleid);
  if (!article) {
    return <div className="text-center mt-10 text-gray-600">Article not found.</div>;
  }

  const created = new Date(article.createdAt);

  // e.g., "Sep 28, 2025"
  const dateStr = created.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // e.g., "14:05" (24h) or "02:05 PM" if hour12: true and locale defaults to 12h
  const timeStr = created.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    // Set to false for 24-hour format; omit or set true if 12-hour is preferred
    hour12: false,
  });

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 flex flex-col items-center">
      <p className="text-sm text-gray-500 mb-6">
        By {article.userEmail} • {dateStr} • {timeStr}
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
