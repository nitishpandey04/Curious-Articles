'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import VisibilityToggle from './VisibilityToggle';
import TagInput from './TagInput';

export default function CreateArticleForm() {
  const [prompt, setPrompt] = useState('');
  const [depth, setDepth] = useState(2);
  const [breadth, setBreadth] = useState(2);
  const [isPublic, setIsPublic] = useState(true);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const id = crypto.randomUUID();

    try {
      const res = await fetch('/api/generate-mdx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          name: prompt,
          depth: parseInt(depth, 10),
          breadth: parseInt(breadth, 10),
          isPublic,
          tags,
        }),
      });

      if (res.ok) {
        router.push('/library');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to generate article');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Topic
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., The history of artificial intelligence"
          />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the main topic or question you want to explore
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Tags
          </label>
          <TagInput tags={tags} onChange={setTags} maxTags={5} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Depth
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={depth}
              onChange={(e) => setDepth(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              How many levels deep (1-5)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Breadth
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={breadth}
              onChange={(e) => setBreadth(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Questions per level (1-5)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
          <div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {isPublic ? 'Public Article' : 'Private Article'}
            </span>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isPublic
                ? 'Anyone can view this article on Explore'
                : 'Only you can view this article'}
            </p>
          </div>
          <VisibilityToggle isPublic={isPublic} onChange={setIsPublic} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating article...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Article
            </>
          )}
        </button>

        {loading && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            This may take a minute depending on depth and breadth settings...
          </p>
        )}
      </form>
    </div>
  );
}
