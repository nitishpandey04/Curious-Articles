import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { DB_NAME, COLLECTIONS } from '@/lib/constants';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/utils/apiResponse';
import { isValidUsername, checkUsernameAvailability } from '@/lib/db/users';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req) {
  try {
    const { email, password, username, name } = await req.json();

    if (!email || !password) {
      return badRequestResponse('Email and password are required');
    }

    if (!EMAIL_REGEX.test(email)) {
      return badRequestResponse('Invalid email format');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return badRequestResponse(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    // Validate username if provided
    if (username) {
      if (!isValidUsername(username)) {
        return badRequestResponse('Username must be 3-30 characters, alphanumeric and underscores only');
      }

      const isAvailable = await checkUsernameAvailability(username);
      if (!isAvailable) {
        return badRequestResponse('Username is already taken');
      }
    }

    // Validate name length if provided
    if (name && name.length > 100) {
      return badRequestResponse('Name must be 100 characters or less');
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection(COLLECTIONS.USERS);

    const existing = await users.findOne({ email });
    if (existing) {
      return badRequestResponse('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);

    const userData = {
      email,
      password: hashed,
      createdAt: new Date(),
    };

    // Add optional profile fields
    if (username) {
      userData.username = username.toLowerCase();
    }
    if (name) {
      userData.name = name.substring(0, 100);
    }

    await users.insertOne(userData);

    return successResponse({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    return errorResponse('Server error');
  }
}
