// app/api/generate-mdx/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
const FASTAPI_URL = `${BASE_URL}/api/create-article`;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'curious-articles';
const COLLECTION_NAME = 'articles';

export async function POST(req) {
  let client;

  try {
    // Require an authenticated session and capture the user's email.
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // Generate article via internal route (no separate backend).
    const fastapiRes = await fetch(FASTAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!fastapiRes.ok) {
      return NextResponse.json({ error: 'Create-article failed' }, { status: 500 });
    }

    const arrayBuffer = await fastapiRes.arrayBuffer();
    const markdownContent = Buffer.from(arrayBuffer).toString('utf-8');

    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const result = await collection.insertOne({
      id: body.id,
      prompt: body.name,
      depth: body.depth,
      breadth: body.breadth,
      content: markdownContent,
      userEmail: session.user.email, // tie article to the logged-in user
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
