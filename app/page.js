import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12">
      <div className="text-center max-w-2xl">
        <div className="mb-6">
          <Image
            src="https://collegeinfogeek.com/wp-content/uploads/2018/11/Essential-Books.jpg"
            alt="Writing illustration"
            width={450}
            height={300}
            className="mx-auto rounded-md shadow"
            priority
          />
        </div>

        <h1 className="text-4xl font-bold mb-4">Welcome to Curious Articles</h1>
        <p className="text-gray-600 text-lg mb-8">
          
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-lg font-medium transition"
          >
            ✍️ Create Article
          </Link>

          <Link
            href="/explore"
            className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 hover:bg-gray-200 text-lg font-medium transition"
          >
            🌐 Explore
          </Link>
        </div>
      </div>
    </main>
  );
}
