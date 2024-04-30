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
    <section className='flex items-center justify-center h-full'>
      <div className='flex flex-col gap-3'>
        <h1>{locale('status.title')}</h1>

        <span>{`${locale('status.updated_at')}: ${new Date(status.updated_at).toLocaleDateString()} ${new Date(status.updated_at).toLocaleTimeString()}`}</span>

        <div className='flex flex-col gap-1'>
          <span>{locale('status.dependencies')}:</span>
          <ul>{locale('status.database')}</ul>
          <li>{`${locale('status.version')}: ${status.dependencies.database.version}`}</li>
          <li>{`${locale('status.max_connections')}: ${status.dependencies.database.max_connections}`}</li>
          <li>{`${locale('status.opened_connections')}: ${status.dependencies.database.opened_connections}`}</li>
        </div>
      </div>
    </section>
  );
}
