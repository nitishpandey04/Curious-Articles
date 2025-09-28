// app/explore/page.js
import Link from 'next/link';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const COLLECTION_NAME = 'articles';

// Locale-aware formatters (server-safe, created once)
const dateFmt = new Intl.DateTimeFormat('en-IN', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
const timeFmt = new Intl.DateTimeFormat('en-IN', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false, // set true for 12h clocks
});

async function getAllArticles() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  try {
    const db = client.db(DB_NAME);
    const projection = {
      _id: 0,
      id: 1,
      prompt: 1,
      createdAt: 1,
      userEmail: 1,
      userName: 1, // if you ever store a display name
    };
    return await db
      .collection(COLLECTION_NAME)
      .find({}, { projection })
      .sort({ createdAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
}

// Optional: force dynamic rendering if you want fresh data on each request
export const dynamic = 'force-dynamic';

export default async function ExplorePage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">🌐 Explore</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-center">No articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((a) => {
            const created = new Date(a.createdAt);
            const dateStr = dateFmt.format(created);
            const timeStr = timeFmt.format(created);
            const author = a.userName || a.userEmail || 'Unknown';

            return (
              <li
                key={a.id}
                className="p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition"
              >
                <Link href={`/article/${a.id}`} className="block">
                  <h2 className="text-lg font-semibold text-blue-600 hover:underline">
                    {a.prompt}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    By {author} • {dateStr} • {timeStr}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
