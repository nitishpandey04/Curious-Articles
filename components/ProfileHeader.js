'use client';

import { formatDate } from '@/lib/utils/dateFormatter';

export default function ProfileHeader({ user, isOwnProfile = false }) {
  const displayName = user.name || user.username || 'Anonymous';
  const joinDate = user.createdAt ? formatDate(user.createdAt) : null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar placeholder - uses first letter of name/username */}
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl font-semibold text-blue-600">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
            {user.username && (
              <p className="text-gray-500">@{user.username}</p>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <a
            href="/settings/profile"
            className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Edit Profile
          </a>
        )}
      </div>

      {user.bio && (
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{user.bio}</p>
      )}

      {joinDate && (
        <p className="mt-4 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Joined {joinDate}
          </span>
        </p>
      )}
    </div>
  );
}
