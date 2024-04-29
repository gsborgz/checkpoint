import { pgDatabase } from '@/core/pg-database';
import { UserLanguage, UserTheme } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type SignupInput = {
  email: string;
  password: string;
  password_confirmation: string;
  theme: UserTheme;
  language: UserLanguage;
};

export async function POST(request: Request) {
  const body: SignupInput = await request.json();

  await checkIfUserDoesNotExist(body.email);

  checkIfPasswordsMatch(body);

  const user = await pgDatabase.user.create({
    data: {
      email: body.email,
      password: await encryptPassword(body.password),
      theme: body.theme,
      language: body.language,
    },
  });

  delete user.password;

  return Response.json(user);
}

async function checkIfUserDoesNotExist(email: string): Promise<void> {
  const user = await pgDatabase.user.findUnique({ where: { email } });

  if (user) {
    throw new Error('text.user_already_exists');
  }
}

async function encryptPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

function checkIfPasswordsMatch(body: SignupInput): void {
  if (body.password !== body.password_confirmation) {
    throw new Error('text.passwords_do_not_match');
  }
}
