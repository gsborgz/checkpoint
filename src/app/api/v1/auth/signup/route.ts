import { pgDatabase } from '@/core/pg-database';
import { UserLanguage, UserTheme } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { serverSignupSchema } from '@/validations/auth';
import { NextResponse } from 'next/server';

type SignupInput = {
  username: string;
  password: string;
  password_confirmation: string;
  theme: UserTheme;
  language: UserLanguage;
};

export async function POST(request: Request) {
  const body: SignupInput = await request.json();

  try {
    serverSignupSchema.validateSync(body);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }

  const dbUser = await pgDatabase.user.findUnique({ where: { username: body.username } })

  if (dbUser) {
    return NextResponse.json(JSON.stringify({ key: 'text.user_already_exists' }), { status: 400 });
  }

  if (body.password !== body.password_confirmation) {
    return NextResponse.json(JSON.stringify({ key: 'text.passwords_do_not_match' }), { status: 400 });
  }

  const user = await pgDatabase.user.create({
    data: {
      username: body.username,
      password: await encryptPassword(body.password),
      theme: body.theme,
      language: body.language,
    },
  });

  delete user.password;

  return Response.json(user);
}

async function encryptPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
