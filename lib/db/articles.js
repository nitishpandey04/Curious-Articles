import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTIONS, ARTICLE_PROJECTION, ARTICLE_FULL_PROJECTION } from '../constants';

const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

async function getCollection() {
  const client = new MongoClient(uri, options);
  await client.connect();
  const db = client.db(DB_NAME);
  return { collection: db.collection(COLLECTIONS.ARTICLES), client };
}

export async function getAllArticles() {
  const { collection, client } = await getCollection();
  try {
    return await collection
      .find({}, { projection: ARTICLE_PROJECTION })
      .sort({ createdAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
}

export async function getArticlesByUser(email) {
  const { collection, client } = await getCollection();
  try {
    return await collection
      .find({ userEmail: email }, { projection: ARTICLE_PROJECTION })
      .sort({ createdAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
}

export async function getArticleById(id) {
  const { collection, client } = await getCollection();
  try {
    return await collection.findOne({ id }, { projection: ARTICLE_FULL_PROJECTION });
  } finally {
    await client.close();
  }
}

export async function createArticle({ id, prompt, depth, breadth, content, userEmail }) {
  const { collection, client } = await getCollection();
  try {
    const result = await collection.insertOne({
      id,
      prompt,
      depth,
      breadth,
      content,
      userEmail,
      createdAt: new Date(),
    });
    return result;
  } finally {
    await client.close();
  }
}
