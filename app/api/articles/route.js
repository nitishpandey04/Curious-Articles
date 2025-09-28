import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB;
const COLLECTION_NAME = 'articles';

export async function GET() {
  let client;
  try {
    // Optional: limit to current user’s articles; comment out if you want all
    const session = await getServerSession(authOptions);

    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const filter = session?.user?.email
      ? { userEmail: session.user.email }
      : {}; // show all if not enforcing auth

    const projection = {
      _id: 0,
      id: 1,
      prompt: 1,
      createdAt: 1,
      userEmail: 1,   // include author email so UI can render it
      userName: 1,    // optional if you also store a display name
    };

    const articles = await collection
      .find(filter, { projection })
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
