import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db/connection';
import User from '@/lib/db/models/User';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        const password = credentials?.password || '';

        if (!email || !password) {
          return null;
        }

        try {
          // Connect to database
          await connectDB();

          // Try to find user in database (include passwordHash for verification)
          const user = await User.findOne({ email }).select('+passwordHash');

          if (user) {
            // Check if user is banned
            if (user.banned) {
              console.error('❌ User is banned:', email);
              return null;
            }

            // If user has a password hash, verify it
            if (user.passwordHash) {
              const isValid = await user.verifyPassword(password);

              if (isValid) {
                return {
                  id: user._id.toString(),
                  email: user.email,
                  name: user.name,
                  isAdmin: user.isAdmin,
                } as any;
              }
            }
          }

          // Fallback: Environment-based admin authentication
          // This is a backup method for initial setup
          const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (adminEmail && adminPassword && adminPassword.length >= 16) {
            if (email === adminEmail && password === adminPassword) {
              // Return a special admin session
              // Note: This won't have a real user ID in the database
              return {
                id: 'env-admin',
                name: 'Admin',
                email: adminEmail,
                isAdmin: true,
              } as any;
            }
          }

          // Authentication failed
          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = (user as any).id;
        token.isAdmin = (user as any).isAdmin || false;
        token.email = (user as any).email;
      }
      if (process.env.ADMIN_EMAIL && token.email?.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
        (session.user as any).isAdmin = token.isAdmin;
      }
      return session;
    },
  },
};
