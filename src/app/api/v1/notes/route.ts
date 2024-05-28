import { Note } from '@prisma/client';
import { pgDatabase } from '@/core/pg-database';
import { getSessionUser } from '@/core/auth';
import { noteSchema } from '@/validations/notes';
import { NextResponse } from 'next/server';

export async function GET() {
  const user = await getSessionUser();
  const notes = await pgDatabase.note.findMany({
    where: { user_id: user.id },
  });
  const sortedByCreatedDesc = notes.sort((a, b) => (a.created_at > b.created_at ? -1 : 1));
  const sortedByFavorite = sortedByCreatedDesc.sort((a, b) => (a.favorite === b.favorite ? 0 : a.favorite ? -1 : 1));

  // TODO: Implementar paginação

  return Response.json(sortedByFavorite);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  const body: Note = await request.json();

  try {
    noteSchema.validateSync(body);
  } catch (error) {
    return NextResponse.json(error.message, { status: 400 });
  }

  body.user_id = user.id;

  // TODO: implementar encriptação e2e

  const note = await pgDatabase.note.create({ data: body });

  return Response.json(note);
}
