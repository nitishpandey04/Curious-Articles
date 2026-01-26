import { MongoClient } from 'mongodb';
import { DB_NAME, COLLECTIONS, USER_PUBLIC_PROJECTION, USER_PRIVATE_PROJECTION } from '../constants';

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
  return { collection: db.collection(COLLECTIONS.USERS), client };
}

// Username validation: 3-30 chars, alphanumeric and underscores only, URL-safe
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,30}$/;

export function isValidUsername(username) {
  return USERNAME_REGEX.test(username);
}

export async function getUserByEmail(email) {
  const { collection, client } = await getCollection();
  try {
    return await collection.findOne({ email }, { projection: USER_PRIVATE_PROJECTION });
  } finally {
    await client.close();
  }
}

export async function getUserByUsername(username) {
  const { collection, client } = await getCollection();
  try {
    return await collection.findOne(
      { username: username.toLowerCase() },
      { projection: USER_PUBLIC_PROJECTION }
    );
  } finally {
    await client.close();
  }
}

export async function checkUsernameAvailability(username) {
  const { collection, client } = await getCollection();
  try {
    const existing = await collection.findOne(
      { username: username.toLowerCase() },
      { projection: { _id: 1 } }
    );
    return !existing;
  } finally {
    await client.close();
  }
}

export async function updateUserProfile(email, { username, name, bio }) {
  const { collection, client } = await getCollection();
  try {
    const updateData = {};

    if (username !== undefined) {
      updateData.username = username.toLowerCase();
    }
    if (name !== undefined) {
      updateData.name = name.substring(0, 100); // Limit name length
    }
    if (bio !== undefined) {
      updateData.bio = bio.substring(0, 500); // Limit bio length
    }

    const result = await collection.updateOne(
      { email },
      { $set: updateData }
    );
    return result;
  } finally {
    await client.close();
  }
}

export async function getFullUserByEmail(email) {
  const { collection, client } = await getCollection();
  try {
    return await collection.findOne(
      { email },
      { projection: { _id: 0, password: 0 } }
    );
  } finally {
    await client.close();
  }
}
