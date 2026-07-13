import { useState, useEffect } from 'react';
import type { CountdownValues, CountdownState } from '../types';

function getState(totalMs: number, snapshotAt: string | null): CountdownState {
  if (totalMs <= 0 && !snapshotAt) return 'waiting';
  if (totalMs <= 0) return 'waiting';
  if (totalMs <= 60_000) return 'imminent';
  if (totalMs <= 600_000) return 'critical';
  if (totalMs <= 3_600_000) return 'warning';
  return 'normal';
}

export function useCountdown(endsAt: string | null, snapshotAt: string | null): CountdownValues {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!endsAt) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, state: 'waiting', totalMs: 0 };
  }

  const end = new Date(endsAt).getTime();
  const totalMs = Math.max(0, end - now);

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    state: getState(totalMs, snapshotAt),
    totalMs,
  };
}
