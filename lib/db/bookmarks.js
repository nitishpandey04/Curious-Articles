import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTIONS, ARTICLE_PROJECTION } from '../constants';

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
    bookmarksCollection: db.collection(COLLECTIONS.BOOKMARKS),
    articlesCollection: db.collection(COLLECTIONS.ARTICLES),
    client,
  };
}

export async function toggleBookmark(articleId, userEmail) {
  const { bookmarksCollection, client } = await getCollections();
  try {
    // Check if bookmark already exists
    const existingBookmark = await bookmarksCollection.findOne({ articleId, userEmail });

    if (existingBookmark) {
      // Remove bookmark
      await bookmarksCollection.deleteOne({ articleId, userEmail });
      return { bookmarked: false };
    } else {
      // Add bookmark
      await bookmarksCollection.insertOne({
        articleId,
        userEmail,
        createdAt: new Date(),
      });
      return { bookmarked: true };
    }
  } finally {
    await client.close();
  }
}

export async function hasUserBookmarked(articleId, userEmail) {
  const { bookmarksCollection, client } = await getCollections();
  try {
    const bookmark = await bookmarksCollection.findOne({ articleId, userEmail });
    return !!bookmark;
  } finally {
    await client.close();
  }
}

export async function getUserBookmarks(userEmail) {
  const { bookmarksCollection, articlesCollection, client } = await getCollections();
  try {
    // Get all bookmark records for the user
    const bookmarks = await bookmarksCollection
      .find({ userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    // Get the article IDs
    const articleIds = bookmarks.map((b) => b.articleId);

    if (articleIds.length === 0) {
      return [];
    }

    // Fetch the corresponding articles (only public ones or owned by user)
    const articles = await articlesCollection
      .find(
        {
          id: { $in: articleIds },
          $or: [
            { isPublic: { $ne: false } },
            { userEmail: userEmail },
          ],
        },
        { projection: ARTICLE_PROJECTION }
      )
      .toArray();

    // Sort articles in the same order as bookmarks (most recently bookmarked first)
    const articleMap = new Map(articles.map((a) => [a.id, a]));
    return articleIds
      .map((id) => articleMap.get(id))
      .filter((a) => a !== undefined);
  } finally {
    await client.close();
  }
}
