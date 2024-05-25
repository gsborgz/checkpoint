import { useLocale } from '@/hooks/locale';
import { noteSchema } from '@/validations/notes';
import { SnackbarContext } from '@/providers/snackbar';
import { PlusIcon, StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { SyntheticEvent, useContext, useState } from 'react';

type CreateNoteButtonProps = {
  onCreate: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function CreateNoteButton({ onCreate }: CreateNoteButtonProps) {
  const favoriteIcon = <SolidStarIcon className='w-5 h-5 text-yellow-400' />;
  const favoriteIconHover = <SolidStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;
  const nonFavoriteIcon = <OutlineStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;
  const [activeFavoriteIcon, setActiveFavoriteIcon] = useState<JSX.Element>(nonFavoriteIcon);
  const [creatingNote, setCreatingNote] = useState(false);
  const [noteDescription, setNoteDescription] = useState('');
  const [noteFavorite, setNoteFavorite] = useState(false);
  const { locale } = useLocale();
  const { showErrorMessage } = useContext(SnackbarContext);

  async function createNote(event: SyntheticEvent) {
    event.preventDefault();

    try {
      const body = { description: noteDescription, favorite: noteFavorite };

      noteSchema.validateSync(body);

      await fetch('/api/v1/notes', { method: 'POST', body: JSON.stringify(body) });

      cleanNoteCreation();

      onCreate();
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
    <>
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
            onMouseEnter={() => setActiveFavoriteIcon(favoriteIconHover)}
            onMouseLeave={() => setActiveFavoriteIcon(nonFavoriteIcon)}
          >
            {noteFavorite ? favoriteIcon : activeFavoriteIcon}
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
    </>
  );
}
