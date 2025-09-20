'use client';

import Link from 'next/link';

export default function NavBar() {
  return (
    <div className="w-full flex flex-col items-center bg-gray-100 shadow-md">
      {/* Top Row - Title */}
      <Link href="/">
        <div className="text-center text-xl font-semibold py-4">
          Curious Articles
        </div>
      </Link>

      {/* Second Row - Buttons */}
      <div className="flex justify-center gap-4 py-2 border-t border-gray-200">
        <Link href="/">
          <button className="px-4 py-2 text-sm rounded hover:bg-gray-100">Home</button>
        </Link>
        <Link href="/create">
          <button className="px-4 py-2 text-sm rounded hover:bg-gray-100">Create</button>
        </Link>
        <Link href="/library">
          <button className="px-4 py-2 text-sm rounded hover:bg-gray-100">Library</button>
        </Link>
      </div>
    </div>
  );
}
