import { RouteParams } from '@/types/utils';
import { getSessionUser } from '@/core/auth';
import { pgDatabase } from '@/core/pg-database';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: RouteParams) {
  const user = await getSessionUser();
  const note = await pgDatabase.note.findUnique({ where: { id: params.id, user_id: user.id } });

  if (!note) {
    return NextResponse.json({ message: 'notes.not_found' }, { status: 404 });
  }

  const updatedNote = await pgDatabase.note.update({ where: { id: params.id }, data: { favorite: !note.favorite } });

  return Response.json(updatedNote);
}
