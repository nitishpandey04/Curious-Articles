'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function CommentItem({ comment, onDelete }) {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isOwner = session?.user?.email === comment.userEmail;

  const handleDelete = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        onDelete?.(comment.id);
      }
    } catch {
      // Handle error silently
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const authorInitial = comment.userName?.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-b-0">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">{authorInitial}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900 text-sm">{comment.userName}</span>
          <span className="text-gray-400 text-xs">·</span>
          <time className="text-gray-400 text-xs" dateTime={comment.createdAt}>
            {formatRelativeTime(comment.createdAt)}
          </time>
        </div>

        <p className="text-gray-700 text-sm whitespace-pre-wrap break-words">{comment.content}</p>

        {/* Actions */}
        {isOwner && (
          <div className="mt-2">
            {showConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Delete this comment?</span>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  {isDeleting ? 'Deleting...' : 'Yes'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="text-xs text-gray-400 hover:text-red-600 transition"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
