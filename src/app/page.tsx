'use client';

import { SnackbarContext } from '@/providers/snackbar';
import { useContext, useEffect, useState } from 'react';
import { Note } from '@prisma/client';
import DeleteButton from '@/components/delete-button';
import FavoriteButton from '@/components/favorite-button';
import CreateNoteButton from '@/components/create-note-button';
import cryptr from '@/utils/cryptr';
import CircleLoader from '@/components/circle-loader';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);

    const result = await (await fetch('/api/v1/notes')).json();
    const decryptedNotes = result.map((note: Note) => {
      return {
        ...note,
        description: cryptr.decrypt(note.description),
      };
    });

    setNotes(decryptedNotes);
    setLoading(false);
  }

  async function updateNoteFavorite(note: Note) {
    try {
      await fetch(`/api/v1/notes/${note.id}/favorite`, {
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

  const notesList = (
    <>
      {notes.map((note, index) => (
        <div
          className='note-card flex w-[60rem] bg-stone-300 p-2 dark:bg-stone-800 rounded-md gap-2 items-center'
          key={note.id}
        >
          <p
            className='flex items-center w-full min-h-[2rem] bg-stone-100 dark:bg-stone-700 rounded-md py-2 px-2 break-words'
            style={{ overflowWrap: 'anywhere' }}
          >
            {note.description}
          </p>

          <FavoriteButton
            id={index.toString()}
            onClick={() => updateNoteFavorite(note)}
            favorite={note.favorite}
          />

          <DeleteButton
            id={index.toString()}
            onClick={() => deleteNote(note)}
          />
        </div>
      ))}
    </>
  );

  return (
    <section className='flex flex-col items-center gap-4 w-full h-full p-4'>
      <CreateNoteButton onCreate={getNotes} />

      <div className='flex flex-col gap-4'>{loading ? <CircleLoader /> : notesList}</div>
    </section>
  );
}
