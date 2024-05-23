'use client';

import { useEffect, useState } from 'react';
import { useLocale } from '@/hooks/locale';
import { AppStatus } from '@/app/api/v1/status/route';

export default function Status() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<AppStatus>();

  useEffect(() => {
    async function getStatus() {
      const res = await fetch('/api/v1/status');
      const data = await res.json();

      setStatus(data);
    }

    getStatus();
  }, []);

  if (!status) {
    return null;
  }

  return (
    <section className='flex flex-col gap-4 h-full w-full items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-3'>
        <h1>{locale('status.title')}</h1>

        <span>
          <span id='status-updated-at'>{`${locale('status.updated_at')}`}</span>:&nbsp;
          <span id='status-updated-at-value'>{`${new Date(status.updated_at).toLocaleDateString()} ${new Date(status.updated_at).toLocaleTimeString()}`}</span>
        </span>

        <div className='flex flex-col gap-1'>
          <span>{locale('status.dependencies')}:</span>
          <ul>{locale('status.database')}</ul>
          <li>
            <span id='db-version'>{`${locale('status.version')}`}</span>:&nbsp;
            <span id='db-version-value'>{`${status.dependencies.database.version}`}</span>
          </li>
          <li>
            <span id='db-max-connections'>{`${locale('status.max_connections')}`}</span>:&nbsp;
            <span id='db-max-connections-value'>{`${status.dependencies.database.max_connections}`}</span>
          </li>
          <li>
            <span id='db-opened-connections'>{`${locale('status.opened_connections')}`}</span>:&nbsp;
            <span id='db-opened-connections-value'>{`${status.dependencies.database.opened_connections}`}</span>
          </li>
        </div>
      </div>
    </section>
  );
}
