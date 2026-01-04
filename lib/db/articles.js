import clientPromise from '../mongodb';
import { DB_NAME, COLLECTIONS, ARTICLE_PROJECTION, ARTICLE_FULL_PROJECTION } from '../constants';

async function getCollection() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  return db.collection(COLLECTIONS.ARTICLES);
}

export async function getAllArticles() {
  const collection = await getCollection();
  return collection
    .find({}, { projection: ARTICLE_PROJECTION })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getArticlesByUser(email) {
  const collection = await getCollection();
  return collection
    .find({ userEmail: email }, { projection: ARTICLE_PROJECTION })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getArticleById(id) {
  const collection = await getCollection();
  return collection.findOne({ id }, { projection: ARTICLE_FULL_PROJECTION });
}

export async function createArticle({ id, prompt, depth, breadth, content, userEmail }) {
  const collection = await getCollection();
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
}
