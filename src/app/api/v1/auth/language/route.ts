import { getSessionUser } from '@/core/auth';
import { UserLanguage } from '@prisma/client';
import { pgDatabase } from '@/core/pg-database';

export type LanguageBody = {
  language: UserLanguage;
};

export async function PUT(request: Request) {
  const sessionUser = await getSessionUser();
  const { id } = await pgDatabase.user.findUniqueOrThrow({ where: { id: sessionUser.id } });
  const { language } = (await request.json()) as LanguageBody;

  await pgDatabase.user.update({
    where: { id },
    data: { language },
  });

  return Response.json({ message: 'text.language_updated' });
}
