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

        // TEMP: hardcoded accounts (no DB)
        const hardcoded = [
          { email: 'admin@local', password: 'admin123', id: 'admin', name: 'Admin', isAdmin: true },
        ];
        const match = hardcoded.find(u => u.email === email && u.password === password);
        if (match) return match as any;

        // Optional env-based admin fallback
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
        const adminPassword = process.env.ADMIN_PASSWORD || '';
        if (email && password && adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
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
