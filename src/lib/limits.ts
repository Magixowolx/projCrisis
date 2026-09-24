export const RECEIVE_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour
export const SEND_COOLDOWN_MS = 60 * 1000;         // 1 minute

export function remainingMs(last: string | null, cooldownMs: number): number {
  if (!last) return 0;
  const elapsed = Date.now() - new Date(last).getTime();
  return Math.max(0, cooldownMs - elapsed);
}

export function humanize(ms: number): string {
  const mins = Math.ceil(ms / 60000);
  if (mins <= 1) return 'a moment';
  if (mins < 60) return `${mins} minutes`;
  const hours = Math.ceil(mins / 60);
  return hours === 1 ? 'an hour' : `${hours} hours`;
}