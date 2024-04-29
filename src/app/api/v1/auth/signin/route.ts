import { pgDatabase } from '@/core/pg-database';
import * as bcrypt from 'bcrypt';

type SigninInput = {
  email: string;
  password: string;
};

export async function POST(request: Request) {
  const body: SigninInput = await request.json();
  const user = await pgDatabase.user.findUnique({ where: { email: body.email } });

  if (!user) {
    throw new Error('text.email_or_password_wrong');
  }

  await comparePassword(body.password, user.password);

  delete user.password;

  return Response.json(user);
}

async function comparePassword(input_password: string, database_password: string): Promise<void> {
  const samePassword = await bcrypt.compare(input_password, database_password);

  if (!samePassword) {
    throw new Error('text.email_or_password_wrong');
  }
}
