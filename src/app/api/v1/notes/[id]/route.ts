import { getSessionUser } from "@/core/auth";
import { pgDatabase } from "@/core/pg-database";
import { Note } from "@prisma/client";
import { RouteParams } from "@/types/utils";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: RouteParams) {
  const body: Note = await request.json();
  const user = await getSessionUser();
  const note = await pgDatabase.note.findUnique({ where: { id: params.id, user_id: user.id } });

  if (!note) {
    return NextResponse.json({ message: 'notes.not_found' }, { status: 404 });
  }

  // TODO: Implementar encriptação e2e
  await pgDatabase.note.update({ where: { id: params.id }, data: body });

  return Response.json({});
  // return Response.json(notes);
}
