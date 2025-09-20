import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'curious-articles';
const COLLECTION_NAME = 'articles';

export async function GET() {
  let client;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Sort by `createdAt` descending (most recent first)
    const articles = await collection
      .find({}, { projection: { _id: 0, id: 1, prompt: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return Response.json({ error: 'Failed to fetch articles' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
