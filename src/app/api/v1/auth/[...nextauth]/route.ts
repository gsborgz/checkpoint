import { authConfig } from '@/core/auth';
import NextAuth from 'next-auth';

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST, authConfig };
