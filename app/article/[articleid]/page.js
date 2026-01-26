import { MDXRemote } from 'next-mdx-remote-client/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getArticleWithOwnerCheck, incrementViewCount } from '@/lib/db/articles';
import { hasUserLiked } from '@/lib/db/likes';
import { hasUserBookmarked } from '@/lib/db/bookmarks';
import { getCommentsByArticle } from '@/lib/db/comments';
import { formatDate } from '@/lib/utils/dateFormatter';
import VisibilityBadge from '@/components/VisibilityBadge';
import ArticleTableOfContents from '@/components/ArticleTableOfContents';
import ArticleSidebar from '@/components/ArticleSidebar';
import EngagementBar from '@/components/EngagementBar';
import CommentsSection from '@/components/CommentsSection';
import ShareButtons from '@/components/ShareButtons';

// Remove citations like [1], [2][3], etc.
function removeCitations(content) {
  return content.replace(/\[\d+\](?:\[\d+\])*/g, '');
}

// Extract headings from markdown content
function extractHeadings(content) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\[\d+\](?:\[\d+\])*/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    headings.push({ level, text, id });
  }

  return headings;
}

export default async function ArticlePage({ params }) {
  const { articleid } = await params;
  const session = await getServerSession(authOptions);

  const article = await getArticleWithOwnerCheck(articleid, session?.user?.email);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Article not found</h1>
          <p className="text-gray-500 mb-8 max-w-md">The article you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse articles
          </Link>
        </div>
      </div>
    );
  }

  if (article.accessDenied) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Private Article</h1>
          <p className="text-gray-500 mb-8 max-w-md">This article is private and can only be viewed by its author.</p>
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Browse public articles
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = session?.user?.email === article.userEmail;
  const dateStr = formatDate(article.createdAt);
  const author = article.userName || article.userEmail?.split('@')[0] || 'Anonymous';

  // Calculate reading time (200 words per minute)
  const wordCount = article.wordCount || (article.content ? article.content.trim().split(/\s+/).length : 0);
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Increment view count (fire and forget, don't block rendering)
  incrementViewCount(articleid).catch(() => {});

  // Fetch engagement data
  const userEmail = session?.user?.email;
  const [userLiked, userBookmarked, comments] = await Promise.all([
    userEmail ? hasUserLiked(articleid, userEmail) : false,
    userEmail ? hasUserBookmarked(articleid, userEmail) : false,
    getCommentsByArticle(articleid),
  ]);

  // Sanitize comments (remove _id)
  const sanitizedComments = comments.map(({ _id, ...comment }) => comment);

  // Process content: remove citations
  const processedContent = removeCitations(article.content);
  const headings = extractHeadings(article.content);

  // Extract title from first h1 or use prompt
  const titleMatch = processedContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1] : article.prompt;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <div className="mb-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Explore
        </Link>
      </div>

      {/* Mobile Table of Contents */}
      <ArticleTableOfContents headings={headings} />

      <div className="lg:grid lg:grid-cols-[1fr_240px] lg:gap-12">
        {/* Main content area */}
        <main className="min-w-0">
          {/* Article header */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{author}</span>
              </div>

              <span className="text-gray-300 dark:text-gray-600">|</span>

              <time className="text-gray-500 dark:text-gray-400" dateTime={article.createdAt}>
                {dateStr}
              </time>

              <span className="text-gray-300 dark:text-gray-600">|</span>

              <span className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {readingTime} min read
              </span>

              {(article.viewCount > 0) && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <span className="text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {article.viewCount} views
                  </span>
                </>
              )}

              {isOwner && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">|</span>
                  <VisibilityBadge isPublic={article.isPublic !== false} />
                </>
              )}
            </div>

            {/* Engagement Bar and Share */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <EngagementBar
                articleId={articleid}
                initialLiked={userLiked}
                initialLikeCount={article.likeCount || 0}
                initialBookmarked={userBookmarked}
              />
              <ShareButtons title={title} />
            </div>
          </header>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 mb-10" />

          {/* Article content */}
          <article className="prose prose-lg max-w-none dark:prose-invert
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:scroll-mt-24
            prose-h1:text-2xl prose-h1:mt-10 prose-h1:mb-4
            prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
            prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-ul:my-4 prose-ol:my-4
            prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-1
            prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
            prose-code:bg-gray-100 dark:prose-code:bg-slate-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-gray-900 dark:prose-pre:bg-slate-800 prose-pre:rounded-xl
          ">
            <MDXRemote
              source={processedContent}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </article>

          {/* Article footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Generated with Curious Articles
              </div>
              <Link
                href="/create"
                className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition"
              >
                Create your own article
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </footer>

          {/* Comments Section */}
          <CommentsSection
            articleId={articleid}
            initialComments={sanitizedComments}
            initialCount={article.commentCount || 0}
          />
        </main>

        {/* Desktop sidebar */}
        <ArticleSidebar headings={headings} />
      </div>
    </div>
  );
}
