import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcrypt';
import { DB_NAME, COLLECTIONS } from '@/lib/constants';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const users = db.collection(COLLECTIONS.USERS);

        const user = await users.findOne({ email: credentials.email });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username || null,
          name: user.name || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On sign in, add user data to token
      if (user) {
        token.username = user.username;
        token.name = user.name;
      }

      // On session update, refresh user data from database
      if (trigger === 'update') {
        const client = await clientPromise;
        const db = client.db(DB_NAME);
        const users = db.collection(COLLECTIONS.USERS);
        const dbUser = await users.findOne({ email: token.email });
        if (dbUser) {
          token.username = dbUser.username || null;
          token.name = dbUser.name || null;
        }
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      session.user.username = token.username;
      session.user.name = token.name;
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
