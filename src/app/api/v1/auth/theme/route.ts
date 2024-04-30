import { getSessionUser } from '@/core/auth';
import { UserTheme } from '@prisma/client';
import { pgDatabase } from '@/core/pg-database';

export type ThemeBody = {
  theme: UserTheme;
};

export async function PUT(request: Request) {
  const sessionUser = await getSessionUser();
  const user = await pgDatabase.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  const body = (await request.json()) as ThemeBody;

  await pgDatabase.user.update({
    where: { id: user.id },
    data: { theme: body.theme },
  });

  return Response.json({ message: 'text.theme_updated' });
}
