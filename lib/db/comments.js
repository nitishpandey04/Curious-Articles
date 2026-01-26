import { MongoClient } from 'mongodb';
import { randomUUID } from 'crypto';
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
    commentsCollection: db.collection(COLLECTIONS.COMMENTS),
    articlesCollection: db.collection(COLLECTIONS.ARTICLES),
    client,
  };
}

export async function getCommentsByArticle(articleId) {
  const { commentsCollection, client } = await getCollections();
  try {
    return await commentsCollection
      .find({ articleId })
      .sort({ createdAt: -1 })
      .toArray();
  } finally {
    await client.close();
  }
}

export async function createComment(articleId, userEmail, userName, content) {
  const { commentsCollection, articlesCollection, client } = await getCollections();
  try {
    const comment = {
      id: randomUUID(),
      articleId,
      userEmail,
      userName,
      content: content.slice(0, 1000), // Enforce max 1000 chars
      createdAt: new Date(),
    };

    await commentsCollection.insertOne(comment);

    // Increment article comment count
    await articlesCollection.updateOne(
      { id: articleId },
      { $inc: { commentCount: 1 } }
    );

    // Return without _id
    const { _id, ...commentWithoutId } = comment;
    return commentWithoutId;
  } finally {
    await client.close();
  }
}

export async function deleteComment(commentId, userEmail) {
  const { commentsCollection, articlesCollection, client } = await getCollections();
  try {
    // Find the comment first to get articleId and verify ownership
    const comment = await commentsCollection.findOne({ id: commentId });

    if (!comment) {
      return { success: false, error: 'Comment not found' };
    }

    if (comment.userEmail !== userEmail) {
      return { success: false, error: 'Unauthorized' };
    }

    // Delete the comment
    await commentsCollection.deleteOne({ id: commentId });

    // Decrement article comment count
    await articlesCollection.updateOne(
      { id: comment.articleId },
      { $inc: { commentCount: -1 } }
    );

    return { success: true };
  } finally {
    await client.close();
  }
}

export async function getCommentById(commentId) {
  const { commentsCollection, client } = await getCollections();
  try {
    return await commentsCollection.findOne({ id: commentId });
  } finally {
    await client.close();
  }
}
