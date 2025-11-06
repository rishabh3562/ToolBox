import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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

        // Environment-based admin authentication
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD;

        // Validate that admin credentials are properly configured
        if (!adminEmail || !adminPassword) {
          console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables');
          return null;
        }

        // Enforce minimum password length for security
        if (adminPassword.length < 16) {
          console.error('❌ ADMIN_PASSWORD must be at least 16 characters long');
          return null;
        }

        // Verify credentials
        if (email && password && email === adminEmail && password === adminPassword) {
          return { id: 'admin', name: 'Admin', email: adminEmail, isAdmin: true } as any;
        }

        return null;
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
