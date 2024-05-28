'use client';

import { TrashIcon as SolidTrashIcon } from '@heroicons/react/24/solid';
import { TrashIcon as OutlineTrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DeleteButton({ onClick, className }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const deleteIconHover = <SolidTrashIcon className='w-5 h-5 text-red-500' />;
  const deleteIcon = <OutlineTrashIcon className='w-5 h-5 text-red-500' />;
  const [deleteNoteIcon, setDeleteNoteIcon] = useState<JSX.Element>(deleteIcon);

  return (
    <button
      type='button'
      onClick={onClick}
      className={className}
      onMouseEnter={() => setDeleteNoteIcon(deleteIconHover)}
      onMouseLeave={() => setDeleteNoteIcon(deleteIcon)}
    >
      {deleteNoteIcon}
    </button>
  );
}
