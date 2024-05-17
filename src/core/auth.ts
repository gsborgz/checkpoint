import { User } from '@prisma/client';
import { AuthOptions, getServerSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { pgDatabase } from '@/core/pg-database';
import * as bcrypt from 'bcrypt';

export const authConfig: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error(JSON.stringify({ key: 'text.no_credentials_provided' }));
        }

        const username = credentials.username as string;
        const password = credentials.password as string;
        const user = await pgDatabase.user.findUnique({ where: { username } });

        if (!user) {
          throw new Error(JSON.stringify({ key: 'text.email_or_password_wrong' }));
        }

        await comparePassword(password, user.password);

        delete user.password;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (trigger === 'update') {
        const sessionUser = await getSessionUser();
        const updatedUser = await pgDatabase.user.findUnique({ where: { id: sessionUser.id } });

        if (!updatedUser) {
          throw new Error(JSON.stringify({ key: 'text.user_not_found' }));
        }

        token.user = updatedUser;
      } else if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ session, token, trigger }) {
      session = {
        ...session,
        user: token.user,
      };

      return session;
    },
  },
};

export async function getSessionUser(): Promise<User> {
  const session = await getServerSession(authConfig);
  const user = session.user as User;

  if (!user || !user.id) {
    throw new Error(JSON.stringify({ key: 'text.unauthenticated' }));
  }

  return user;
}

async function comparePassword(input_password: string, database_password: string): Promise<void> {
  const samePassword = await bcrypt.compare(input_password, database_password);

  if (!samePassword) {
    throw new Error(JSON.stringify({ key: 'text.email_or_password_wrong' }));
  }
}
