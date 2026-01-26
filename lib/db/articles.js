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
    // Only return public articles (treat missing isPublic as public for backward compatibility)
    return await collection
      .find({ isPublic: { $ne: false } }, { projection: ARTICLE_PROJECTION })
      .sort({ createdAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
}

export async function getPublicArticlesByUsername(username) {
  const { collection, client } = await getCollection();
  try {
    // Get public articles by username (stored in userName field)
    return await collection
      .find(
        { userName: username, isPublic: { $ne: false } },
        { projection: ARTICLE_PROJECTION }
      )
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

export async function createArticle({ id, prompt, depth, breadth, content, userEmail, userName, isPublic = true, tags = [] }) {
  const { collection, client } = await getCollection();
  try {
    // Calculate word count from content
    const wordCount = content ? content.trim().split(/\s+/).length : 0;

    const result = await collection.insertOne({
      id,
      prompt,
      depth,
      breadth,
      content,
      userEmail,
      userName,
      isPublic,
      tags,
      wordCount,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date(),
    });
    return result;
  } finally {
    await client.close();
  }
}

export async function incrementViewCount(id) {
  const { collection, client } = await getCollection();
  try {
    await collection.updateOne(
      { id },
      { $inc: { viewCount: 1 } }
    );
  } finally {
    await client.close();
  }
}

export async function updateArticleVisibility(id, userEmail, isPublic) {
  const { collection, client } = await getCollection();
  try {
    const result = await collection.updateOne(
      { id, userEmail },
      { $set: { isPublic } }
    );
    return result;
  } finally {
    await client.close();
  }
}

export async function getArticleWithOwnerCheck(id, userEmail) {
  const { collection, client } = await getCollection();
  try {
    const article = await collection.findOne({ id }, { projection: ARTICLE_FULL_PROJECTION });
    if (!article) return null;

    // If article is public or user is the owner, return it
    if (article.isPublic !== false || article.userEmail === userEmail) {
      return article;
    }

    // Private article and user is not owner
    return { accessDenied: true };
  } finally {
    await client.close();
  }
}
