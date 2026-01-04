import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { DB_NAME, COLLECTIONS } from '@/lib/constants';
import { successResponse, errorResponse, badRequestResponse } from '@/lib/utils/apiResponse';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return badRequestResponse('Email and password are required');
    }

    if (!EMAIL_REGEX.test(email)) {
      return badRequestResponse('Invalid email format');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return badRequestResponse(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const users = db.collection(COLLECTIONS.USERS);

    const existing = await users.findOne({ email });
    if (existing) {
      return badRequestResponse('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    await users.insertOne({ email, password: hashed });

    return successResponse({ success: true });
  } catch (err) {
    console.error('Signup error:', err);
    return errorResponse('Server error');
  }
}
