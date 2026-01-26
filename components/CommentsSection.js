'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

export default function CommentsSection({ articleId, initialComments = [], initialCount = 0 }) {
  const [comments, setComments] = useState(initialComments);
  const [commentCount, setCommentCount] = useState(initialCount);

  const handleCommentAdded = (newComment) => {
    setComments([newComment, ...comments]);
    setCommentCount(commentCount + 1);
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
    setCommentCount(Math.max(0, commentCount - 1));
  };

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({commentCount})
      </h2>

      {/* Comment Form */}
      <div className="mb-6">
        <CommentForm articleId={articleId} onCommentAdded={handleCommentAdded} />
      </div>

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onDelete={handleCommentDeleted}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  );
}
