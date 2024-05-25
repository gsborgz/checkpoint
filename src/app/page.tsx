'use client';

import { SnackbarContext } from '@/providers/snackbar';
import { useContext, useEffect, useState } from 'react';
import { Note } from '@prisma/client';
import DeleteButton from '@/components/delete-button';
import FavoriteButton from '@/components/favorite-button';
import CreateNoteButton from '@/components/create-note-button';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const { showErrorMessage } = useContext(SnackbarContext);

  useEffect(() => {
    setMounted(true);

    if (mounted) {
      getNotes();
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  async function getNotes() {
    const result = await (await fetch('/api/v1/notes')).json();

    setNotes(result);
  }

  async function updateNoteFavorite(note: Note) {
    try {
      await fetch(`/api/v1/notes/${note.id}`, {
        method: 'PUT',
        body: JSON.stringify({ favorite: !note.favorite }),
      });

      getNotes();
    } catch (error) {
      showErrorMessage(error.message);
    }
  }

  async function deleteNote(note: Note) {
    try {
      await fetch(`/api/v1/notes/${note.id}`, { method: 'DELETE' });

      getNotes();
    } catch (error) {
      showErrorMessage(error.message);
    }
  }

  return (
    <section className='flex flex-col items-center gap-4 w-full h-full p-4'>
      <CreateNoteButton onCreate={getNotes} />

      {notes.map((note) => (
        <div
          className='flex w-[60rem] bg-stone-300 p-2 dark:bg-stone-800 rounded-md gap-2 items-center'
          key={note.id}
        >
          <span className='flex items-center w-full h-10 bg-stone-100 dark:bg-stone-700 rounded-md py-1 px-2'>
            {note.description}
          </span>

          <FavoriteButton
            onClick={() => updateNoteFavorite(note)}
            favorite={note.favorite}
          />

          <DeleteButton onClick={() => deleteNote(note)} />
        </div>
      ))}
    </section>
  );
}
