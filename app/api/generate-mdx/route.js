// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// const FASTAPI_URL = 'http://127.0.0.1:8000/create_article';

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const fastapiRes = await fetch(FASTAPI_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });

//     if (!fastapiRes.ok) {
//       return NextResponse.json({ error: 'FastAPI failed' }, { status: 500 });
//     }

//     const arrayBuffer = await fastapiRes.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const articlesDir = path.join(process.cwd(), 'articles');
//     if (!fs.existsSync(articlesDir)) {
//       fs.mkdirSync(articlesDir, { recursive: true });
//     }

//     const filePath = path.join(articlesDir, `${body.id}.md`);
//     fs.writeFileSync(filePath, buffer);

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     console.error('API error:', err);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }





import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const FASTAPI_URL = 'http://127.0.0.1:8000/create_article';
const MONGODB_URI = process.env.MONGODB_URI; // put this in your .env.local file
const DB_NAME = 'curious-articles';
const COLLECTION_NAME = 'articles';

export async function POST(req) {
  let client;

  try {
    const body = await req.json();

    // Call FastAPI to generate article
    const fastapiRes = await fetch(FASTAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!fastapiRes.ok) {
      return NextResponse.json({ error: 'FastAPI failed' }, { status: 500 });
    }

    // Read generated markdown file as string
    const arrayBuffer = await fastapiRes.arrayBuffer();
    const markdownContent = Buffer.from(arrayBuffer).toString('utf-8');

    // Connect to MongoDB
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Insert article into collection
    const result = await collection.insertOne({
      id: body.id,
      prompt: body.name,
      depth: body.depth,
      breadth: body.breadth,
      content: markdownContent,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if (client) {
      await client.close();
    }
  }
}
