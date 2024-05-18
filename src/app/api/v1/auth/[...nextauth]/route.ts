import NextAuth from 'next-auth';
import { authConfig } from '@/core/auth';

const config = { ...authConfig };
const handler = NextAuth(config);

export { handler as GET, handler as POST, config };
