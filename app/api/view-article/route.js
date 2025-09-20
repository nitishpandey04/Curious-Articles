import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'curious-articles';
const COLLECTION_NAME = 'articles';

export async function POST(req) {
  const { id } = await req.json();

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const article = await db.collection(COLLECTION_NAME).findOne({ id });
    await client.close();

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Save to a temporary .mdx file
    const tmpDir = path.join(process.cwd(), 'tmp-mdx');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    const filePath = path.join(process.cwd(), 'tmp-mdx', 'temp.mdx');
    fs.writeFileSync(filePath, article.content, 'utf8');

    return NextResponse.json({ success: true, id });
  } catch (err) {
    console.error('Error saving MDX file:', err);
    return NextResponse.json({ error: 'Failed to save .mdx' }, { status: 500 });
  }
}
