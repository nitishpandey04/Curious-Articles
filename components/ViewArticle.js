'use client';

import dynamic from 'next/dynamic';

export default function ViewArticle({ id }) {
    const ArticleComponent = dynamic(() => import(`@/tmp-mdx/temp.mdx`), {
    ssr: false,
    loading: () => <p>Loading article...</p>,
    });

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 prose">
      <ArticleComponent />
    </div>
  );
}
