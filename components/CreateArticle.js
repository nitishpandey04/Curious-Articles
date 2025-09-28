'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export default function CreateArticleForm() {
  const [prompt, setPrompt] = useState('');
  const [depth, setDepth] = useState(1);
  const [breadth, setBreadth] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const id = generateUniqueId();

    const res = await fetch('/api/generate-mdx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        name: prompt,
        depth: parseInt(depth, 10),
        breadth: parseInt(breadth, 10),
      }),
    });

    setLoading(false);

    if (res.ok) {
      router.push('/');
    } else {
      alert('Failed to generate file');
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        {/* Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prompt</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter article topic"
          />
        </div>

        {/* Depth & Breadth Side by Side */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Depth</label>
            <input
              type="number"
              min="1"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Breadth</label>
            <input
              type="number"
              min="1"
              value={breadth}
              onChange={(e) => setBreadth(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Generate'}
        </button>
      </form>
    </div>
  );
}
