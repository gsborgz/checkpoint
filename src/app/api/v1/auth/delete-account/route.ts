import { pgDatabase } from '@/core/pg-database';
import { getSessionUser } from '@/core/auth';

export async function DELETE() {
  const sessionUser = await getSessionUser();
  const user = await pgDatabase.user.findUniqueOrThrow({ where: { id: sessionUser.id } });

  await pgDatabase.user.delete({ where: { id: user.id } });

  return Response.json({ message: 'text.account_deleted' });
}
