// Centralized constants for the application

export const DB_NAME = process.env.MONGODB_DB || 'curious-articles';

export const COLLECTIONS = {
  ARTICLES: 'articles',
  USERS: 'users',
};

export const ARTICLE_PROJECTION = {
  _id: 0,
  id: 1,
  prompt: 1,
  createdAt: 1,
  userEmail: 1,
  userName: 1,
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
};
