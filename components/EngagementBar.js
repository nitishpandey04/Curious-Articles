'use client';

import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';

export default function EngagementBar({
  articleId,
  initialLiked = false,
  initialLikeCount = 0,
  initialBookmarked = false,
}) {
  return (
    <div className="flex items-center gap-3">
      <LikeButton
        articleId={articleId}
        initialLiked={initialLiked}
        initialCount={initialLikeCount}
      />
      <BookmarkButton
        articleId={articleId}
        initialBookmarked={initialBookmarked}
      />
    </div>
  );
}
