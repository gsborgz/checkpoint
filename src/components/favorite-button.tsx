'use client';

import { StarIcon as SolidStarIcon } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStarIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

type FavoriteButtonProps = {
  favorite: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function FavoriteButton({ onClick, favorite, className }: FavoriteButtonProps) {
  const favoriteIcon = <SolidStarIcon className='w-5 h-5 text-yellow-400' />;
  const favoriteIconHover = <SolidStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;
  const nonFavoriteIcon = <OutlineStarIcon className='w-5 h-5 text-stone-950 dark:text-stone-100' />;
  const [activeFavoriteIcon, setActiveFavoriteIcon] = useState<JSX.Element>(nonFavoriteIcon);

  return (
    <button
      type='button'
      onClick={onClick}
      onMouseEnter={() => setActiveFavoriteIcon(favoriteIconHover)}
      onMouseLeave={() => setActiveFavoriteIcon(nonFavoriteIcon)}
    >
      {favorite ? favoriteIcon : activeFavoriteIcon}
    </button>
  );
}
