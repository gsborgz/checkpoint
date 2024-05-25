'use client';

import { noteSchema } from '@/validations/notes';
import { SnackbarContext } from '@/providers/snackbar';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { Note } from '@prisma/client';
import { PlusIcon, StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocale } from '@/hooks/locale';
import { DeleteButton } from '../components/delete-button';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [creatingNote, setCreatingNote] = useState(false);
  const [noteDescription, setNoteDescription] = useState('');
  const [noteFavorite, setNoteFavorite] = useState(false);
  const { showErrorMessage } = useContext(SnackbarContext);
  const { locale } = useLocale();
  const favoriteIcon = <SolidStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;
  const nonFavoriteIcon = <OutlineStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;

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

  async function createNote(event: SyntheticEvent) {
    event.preventDefault();

    try {
      const body = { description: noteDescription, favorite: noteFavorite };

      noteSchema.validateSync(body);

      await fetch('/api/v1/notes', { method: 'POST', body: JSON.stringify(body) });

      cleanNoteCreation();
      getNotes();
    } catch (error) {
      showErrorMessage(error.message);
    }
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

  function cleanNoteCreation() {
    setCreatingNote(false);
    setNoteDescription('');
    setNoteFavorite(false);
  }

  return (
    <section className='flex flex-col items-center gap-4 w-full h-full p-4'>
      {!creatingNote ? (
        <div>
          <button
            type='button'
            className='p-3 border dark:border-stone-100 border-stone-950 rounded-md'
            onClick={() => setCreatingNote(true)}
          >
            <PlusIcon className='w-[1.9rem] h-[1.9rem]' />
          </button>
        </div>
      ) : (
        <form
          className='flex w-[60rem] items-center bg-stone-300 p-2 dark:bg-stone-800 rounded-md gap-4'
          onSubmit={createNote}
        >
          <input
            className='h-10 w-full rounded-md p-2 bg-transparent border dark:border-stone-100 border-stone-950'
            type='text'
            name='note_description'
            placeholder={locale('notes.type_your_thoughts')}
            autoFocus
            onChange={(e) => setNoteDescription(e.target.value)}
          />

          <button
            type='button'
            onClick={() => setNoteFavorite(!noteFavorite)}
          >
            {noteFavorite ? favoriteIcon : nonFavoriteIcon}
          </button>

          <button type='submit'>
            <CheckIcon className='w-5 h-5 text-green-400' />
          </button>

          <button
            type='button'
            onClick={cleanNoteCreation}
          >
            <XMarkIcon className='w-5 h-5 text-red-500' />
          </button>
        </form>
      )}

      {notes.map((note) => (
        <div
          className='flex w-[60rem] bg-stone-300 p-2 dark:bg-stone-800 rounded-md gap-2 items-center'
          key={note.id}
        >
          <span className='flex items-center w-full h-10 bg-stone-100 dark:bg-stone-700 rounded-md py-1 px-2'>
            {note.description}
          </span>

          <button
            type='button'
            onClick={() => updateNoteFavorite(note)}
          >
            {note.favorite ? favoriteIcon : nonFavoriteIcon}
          </button>

          <DeleteButton onClick={() => deleteNote(note)} />
        </div>
      ))}
    </section>
  );
}
