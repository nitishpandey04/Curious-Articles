import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
// import { mdxComponents } from '@/mdx-components'; // adjust path as needed

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
  const { articleid } = await params;
  const article = await getArticleById(articleid);
  
  if (!article) {
    return <div className="text-center mt-10 text-gray-600">Article not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 flex flex-col items-center">
      {/* <h1 className="text-2xl font-bold mb-4">{article.prompt}</h1> */}
      <p className="text-sm text-gray-500 mb-6">
        Created: {new Date(article.createdAt).toLocaleString()}
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
        {/* components={mdxComponents} */}
      </article>
    </div>
  );
}
