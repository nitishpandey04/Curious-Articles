import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTIONS } from '../constants';

const uri = process.env.MONGODB_URI;

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

async function getCollections() {
  const client = new MongoClient(uri, options);
  await client.connect();
  const db = client.db(DB_NAME);
  return {
    likesCollection: db.collection(COLLECTIONS.LIKES),
    articlesCollection: db.collection(COLLECTIONS.ARTICLES),
    client,
  };
}

export async function toggleLike(articleId, userEmail) {
  const { likesCollection, articlesCollection, client } = await getCollections();
  try {
    // Check if like already exists
    const existingLike = await likesCollection.findOne({ articleId, userEmail });

    if (existingLike) {
      // Unlike: remove the like and decrement count
      await likesCollection.deleteOne({ articleId, userEmail });
      await articlesCollection.updateOne(
        { id: articleId },
        { $inc: { likeCount: -1 } }
      );

      // Get updated count
      const article = await articlesCollection.findOne({ id: articleId }, { projection: { likeCount: 1 } });
      return { liked: false, likeCount: article?.likeCount || 0 };
    } else {
      // Like: add the like and increment count
      await likesCollection.insertOne({
        articleId,
        userEmail,
        createdAt: new Date(),
      });
      await articlesCollection.updateOne(
        { id: articleId },
        { $inc: { likeCount: 1 } }
      );

      // Get updated count
      const article = await articlesCollection.findOne({ id: articleId }, { projection: { likeCount: 1 } });
      return { liked: true, likeCount: article?.likeCount || 0 };
    }
  } finally {
    await client.close();
  }
}

export async function hasUserLiked(articleId, userEmail) {
  const { likesCollection, client } = await getCollections();
  try {
    const like = await likesCollection.findOne({ articleId, userEmail });
    return !!like;
  } finally {
    await client.close();
  }
}

export async function getLikeCount(articleId) {
  const { likesCollection, client } = await getCollections();
  try {
    return await likesCollection.countDocuments({ articleId });
  } finally {
    await client.close();
  }
}
