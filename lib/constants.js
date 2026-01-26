// Centralized constants for the application

export const DB_NAME = process.env.MONGODB_DB || 'curious-articles';

export const COLLECTIONS = {
  ARTICLES: 'articles',
  USERS: 'users',
  LIKES: 'likes',
  BOOKMARKS: 'bookmarks',
  COMMENTS: 'comments',
};

export const ARTICLE_PROJECTION = {
  _id: 0,
  id: 1,
  prompt: 1,
  createdAt: 1,
  userEmail: 1,
  userName: 1,
  isPublic: 1,
  likeCount: 1,
  commentCount: 1,
};

export const ARTICLE_FULL_PROJECTION = {
  _id: 0,
  id: 1,
  prompt: 1,
  content: 1,
  createdAt: 1,
  userEmail: 1,
  userName: 1,
  depth: 1,
  breadth: 1,
  isPublic: 1,
  likeCount: 1,
  commentCount: 1,
};

// User projections
export const USER_PUBLIC_PROJECTION = {
  _id: 0,
  username: 1,
  name: 1,
  bio: 1,
  createdAt: 1,
};

export const USER_PRIVATE_PROJECTION = {
  _id: 0,
  email: 1,
  username: 1,
  name: 1,
  bio: 1,
  createdAt: 1,
};
