import { User } from '@prisma/client';
import { AuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('text.no_credentials_provided');
        }

        const email = credentials.email as string;
        const password = credentials.password as string;
        const response = await fetch(`${process.env.API_BASE_PATH}/v1/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const user = await response.json();

        if (!response.ok || !user) {
          throw new Error('text.invalid_credentials');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      user && (token.user = user)
      return token
    },

    async session({ session, token }) {
      session = token.user as any
      return session
    }
  }
};

export async function getSessionUser(): Promise<User> {
  const session: User = await getServerSession(authConfig);

  if (!session || !session.id) {
    throw new Error('text.unauthenticated');
  }

  return session;
}
